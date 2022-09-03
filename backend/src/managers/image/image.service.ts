import { Injectable, Logger } from '@nestjs/common';
import Crypto from 'crypto';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { ImageRequestParams } from 'picsur-shared/dist/dto/api/image.dto';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import {
  AnimFileType,
  FileType,
  ImageFileType,
  Mime2FileType
} from 'picsur-shared/dist/dto/mimes.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.enum';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { FindResult } from 'picsur-shared/dist/types/find-result';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { IsQOI } from 'qoi-img';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service';
import { UsrPreferenceDbService } from '../../collections/preference-db/usr-preference-db.service';
import { EImageDerivativeBackend } from '../../database/entities/image-derivative.entity';
import { EImageFileBackend } from '../../database/entities/image-file.entity';
import { EImageBackend } from '../../database/entities/image.entity';
import { MutexFallBack } from '../../util/mutex-fallback';
import { ImageConverterService } from './image-converter.service';
import { ImageProcessorService } from './image-processor.service';
import { WebPInfo } from './webpinfo/webpinfo';

@Injectable()
export class ImageManagerService {
  private readonly logger = new Logger(ImageManagerService.name);

  constructor(
    private readonly imagesService: ImageDBService,
    private readonly imageFilesService: ImageFileDBService,
    private readonly processService: ImageProcessorService,
    private readonly convertService: ImageConverterService,
    private readonly userPref: UsrPreferenceDbService,
    private readonly sysPref: SysPreferenceDbService,
  ) {}

  public async findOne(id: string): AsyncFailable<EImageBackend> {
    return await this.imagesService.findOne(id, undefined);
  }

  public async findMany(
    count: number,
    page: number,
    userid: string | undefined,
  ): AsyncFailable<FindResult<EImageBackend>> {
    return await this.imagesService.findMany(count, page, userid);
  }

  public async deleteMany(
    ids: string[],
    userid: string | undefined,
  ): AsyncFailable<EImageBackend[]> {
    return await this.imagesService.delete(ids, userid);
  }

  public async deleteWithKey(
    imageId: string,
    key: string,
  ): AsyncFailable<EImageBackend> {
    return await this.imagesService.deleteWithKey(imageId, key);
  }

  public async upload(
    userid: string,
    filename: string,
    image: Buffer,
    withDeleteKey: boolean,
  ): AsyncFailable<EImageBackend> {
    const fileType = await this.getFileTypeFromBuffer(image);
    if (HasFailed(fileType)) return fileType;

    // Check if need to save orignal
    const keepOriginal = await this.userPref.getBooleanPreference(
      userid,
      UsrPreference.KeepOriginal,
    );
    if (HasFailed(keepOriginal)) return keepOriginal;

    // Process
    const processResult = await this.processService.process(image, fileType);
    if (HasFailed(processResult)) return processResult;

    // Strip extension from filename
    const name = (() => {
      const index = filename.lastIndexOf('.');
      if (index === -1) return filename;
      return filename.substring(0, index);
    })();

    // Save processed to db
    const imageEntity = await this.imagesService.create(
      userid,
      name,
      withDeleteKey,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    const imageFileEntity = await this.imageFilesService.setFile(
      imageEntity.id,
      ImageEntryVariant.MASTER,
      processResult.image,
      processResult.filetype,
    );
    if (HasFailed(imageFileEntity)) return imageFileEntity;

    if (keepOriginal) {
      const originalFileEntity = await this.imageFilesService.setFile(
        imageEntity.id,
        ImageEntryVariant.ORIGINAL,
        image,
        fileType.identifier,
      );
      if (HasFailed(originalFileEntity)) return originalFileEntity;
    }

    return imageEntity;
  }

  public async getConverted(
    imageId: string,
    fileType: string,
    options: ImageRequestParams,
  ): AsyncFailable<EImageDerivativeBackend> {
    const targetFileType = ParseFileType(fileType);
    if (HasFailed(targetFileType)) return targetFileType;

    const converted_key = this.getConvertHash({ mime: fileType, ...options });

    const [save_derivatives, allow_editing] = await Promise.all([
      this.sysPref.getBooleanPreference(SysPreference.SaveDerivatives),
      this.sysPref.getBooleanPreference(SysPreference.AllowEditing),
    ]);
    if (HasFailed(save_derivatives)) return save_derivatives;
    if (HasFailed(allow_editing)) return allow_editing;

    return MutexFallBack(
      converted_key,
      () => {
        if (save_derivatives)
          return this.imageFilesService.getDerivative(imageId, converted_key);
        else return Promise.resolve(null);
      },
      async () => {
        const masterImage = await this.getMaster(imageId);
        if (HasFailed(masterImage)) return masterImage;

        const sourceFileType = ParseFileType(masterImage.filetype);
        if (HasFailed(sourceFileType)) return sourceFileType;

        const startTime = Date.now();
        const convertResult = await this.convertService.convert(
          masterImage.data,
          sourceFileType,
          targetFileType,
          allow_editing ? options : {},
        );
        if (HasFailed(convertResult)) return convertResult;

        this.logger.verbose(
          `Converted ${imageId} from ${sourceFileType.identifier} to ${
            targetFileType.identifier
          } in ${Date.now() - startTime}ms`,
        );

        if (save_derivatives) {
          return await this.imageFilesService.addDerivative(
            imageId,
            converted_key,
            convertResult.filetype,
            convertResult.image,
          );
        } else {
          const derivative = new EImageDerivativeBackend();
          derivative.filetype = convertResult.filetype;
          derivative.data = convertResult.image;
          derivative.image_id = imageId;
          derivative.key = converted_key;
          return derivative;
        }
      },
    );
  }

  // File getters ==============================================================

  public async getMaster(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getFile(imageId, ImageEntryVariant.MASTER);
  }

  public async getMasterFileType(imageId: string): AsyncFailable<FileType> {
    const mime = await this.imageFilesService.getFileTypes(imageId);
    if (HasFailed(mime)) return mime;

    if (mime['master'] === undefined)
      return Fail(FT.NotFound, 'No master file');

    return ParseFileType(mime['master']);
  }

  public async getOriginal(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getFile(imageId, ImageEntryVariant.ORIGINAL);
  }

  public async getOriginalFileType(imageId: string): AsyncFailable<FileType> {
    const filetypes = await this.imageFilesService.getFileTypes(imageId);
    if (HasFailed(filetypes)) return filetypes;

    if (filetypes['original'] === undefined)
      return Fail(FT.NotFound, 'No original file');

    return ParseFileType(filetypes['original']);
  }

  public async getFileMimes(imageId: string): AsyncFailable<{
    [ImageEntryVariant.MASTER]: string;
    [ImageEntryVariant.ORIGINAL]: string | undefined;
  }> {
    const result = await this.imageFilesService.getFileTypes(imageId);
    if (HasFailed(result)) return result;

    if (result[ImageEntryVariant.MASTER] === undefined) {
      return Fail(FT.NotFound, 'No master file found');
    }

    return {
      [ImageEntryVariant.MASTER]: result[ImageEntryVariant.MASTER]!,
      [ImageEntryVariant.ORIGINAL]: result[ImageEntryVariant.ORIGINAL],
    };
  }

  // Util stuff ==================================================================

  private async getFileTypeFromBuffer(image: Buffer): AsyncFailable<FileType> {
    const filetypeResult: FileTypeResult | undefined = await fileTypeFromBuffer(
      image,
    );

    let mime: string | undefined;
    if (filetypeResult === undefined) {
      if (IsQOI(image)) mime = 'image/qoi';
    } else {
      mime = filetypeResult.mime;
    }

    if (mime === undefined) mime = 'other/unknown';

    let filetype: string | undefined;
    if (mime === 'image/webp') {
      const header = await WebPInfo.from(image);
      if (header.summary.isAnimated) filetype = AnimFileType.WEBP;
      else filetype = ImageFileType.WEBP;
    }
    if (filetype === undefined) {
      const parsed = Mime2FileType(mime);
      if (HasFailed(parsed)) return parsed;
      filetype = parsed;
    }

    return ParseFileType(filetype);
  }

  private getConvertHash(options: object) {
    // Return a sha256 hash of the stringified options
    const stringified = JSON.stringify(options);
    const hash = Crypto.createHash('sha256');
    hash.update(stringified);
    const digest = hash.digest('hex');
    return digest;
  }
}
