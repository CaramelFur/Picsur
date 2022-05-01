import { Injectable, Logger } from '@nestjs/common';
import Crypto from 'crypto';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { ImageRequestParams } from 'picsur-shared/dist/dto/api/image.dto';
import { ImageFileType } from 'picsur-shared/dist/dto/image-file-types.dto';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { IsQOI } from 'qoi-img';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { SysPreferenceService } from '../../collections/preference-db/sys-preference-db.service';
import { UsrPreferenceService } from '../../collections/preference-db/usr-preference-db.service';
import { EImageDerivativeBackend } from '../../models/entities/image-derivative.entity';
import { EImageFileBackend } from '../../models/entities/image-file.entity';
import { EImageBackend } from '../../models/entities/image.entity';
import { MutexFallBack } from '../../models/util/mutex-fallback';
import { ImageConverterService } from './image-converter.service';
import { ImageProcessorService } from './image-processor.service';

@Injectable()
export class ImageManagerService {
  private readonly logger = new Logger(ImageManagerService.name);

  constructor(
    private readonly imagesService: ImageDBService,
    private readonly imageFilesService: ImageFileDBService,
    private readonly processService: ImageProcessorService,
    private readonly convertService: ImageConverterService,
    private readonly userPref: UsrPreferenceService,
    private readonly sysPref: SysPreferenceService,
  ) {}

  public async retrieveInfo(id: string): AsyncFailable<EImageBackend> {
    return await this.imagesService.findOne(id);
  }

  // Image data buffer is not included by default, this also returns that buffer
  // Dont send to client, keep in backend
  public async retrieveComplete(id: string): AsyncFailable<EImageBackend> {
    return await this.imagesService.findOne(id);
  }

  public async upload(
    image: Buffer,
    userid: string,
  ): AsyncFailable<EImageBackend> {
    const fullMime = await this.getFullMimeFromBuffer(image);
    if (HasFailed(fullMime)) return fullMime;

    // Check if need to save orignal
    const keepOriginal = await this.userPref.getBooleanPreference(
      userid,
      UsrPreference.KeepOriginal,
    );
    if (HasFailed(keepOriginal)) return keepOriginal;

    // Process
    const processResult = await this.processService.process(image, fullMime);
    if (HasFailed(processResult)) return processResult;

    // Save processed to db
    const imageEntity = await this.imagesService.create();
    if (HasFailed(imageEntity)) return imageEntity;

    const imageFileEntity = await this.imageFilesService.setFile(
      imageEntity.id,
      ImageFileType.MASTER,
      processResult.image,
      processResult.mime,
    );
    if (HasFailed(imageFileEntity)) return imageFileEntity;

    if (keepOriginal) {
      const originalFileEntity = await this.imageFilesService.setFile(
        imageEntity.id,
        ImageFileType.ORIGINAL,
        image,
        fullMime.mime,
      );
      if (HasFailed(originalFileEntity)) return originalFileEntity;
    }

    return imageEntity;
  }

  public async getConverted(
    imageId: string,
    mime: string,
    options: ImageRequestParams,
  ): AsyncFailable<EImageDerivativeBackend> {
    const targetMime = ParseMime(mime);
    if (HasFailed(targetMime)) return targetMime;

    const converted_key = this.getConvertHash({ mime, ...options });

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

        const sourceMime = ParseMime(masterImage.mime);
        if (HasFailed(sourceMime)) return sourceMime;

        const startTime = Date.now();
        const convertResult = await this.convertService.convert(
          masterImage.data,
          sourceMime,
          targetMime,
          allow_editing ? options : {},
        );
        if (HasFailed(convertResult)) return convertResult;

        this.logger.verbose(
          `Converted ${imageId} from ${sourceMime.mime} to ${
            targetMime.mime
          } in ${Date.now() - startTime}ms`,
        );

        if (save_derivatives) {
          return await this.imageFilesService.addDerivative(
            imageId,
            converted_key,
            convertResult.mime,
            convertResult.image,
          );
        } else {
          const derivative = new EImageDerivativeBackend();
          derivative.mime = convertResult.mime;
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
    return this.imageFilesService.getFile(imageId, ImageFileType.MASTER);
  }

  public async getMasterMime(imageId: string): AsyncFailable<FullMime> {
    const mime = await this.imageFilesService.getFileMime(
      imageId,
      ImageFileType.MASTER,
    );
    if (HasFailed(mime)) return mime;

    return ParseMime(mime);
  }

  public async getOriginal(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getFile(imageId, ImageFileType.ORIGINAL);
  }

  public async getOriginalMime(imageId: string): AsyncFailable<FullMime> {
    const mime = await this.imageFilesService.getFileMime(
      imageId,
      ImageFileType.ORIGINAL,
    );
    if (HasFailed(mime)) return mime;

    return ParseMime(mime);
  }

  public async getAllFileMimes(imageId: string): AsyncFailable<{
    [ImageFileType.MASTER]: string;
    [ImageFileType.ORIGINAL]: string | undefined;
  }> {
    const result = await this.imageFilesService.getFileMimes(imageId, [
      ImageFileType.MASTER,
      ImageFileType.ORIGINAL,
    ]);
    if (HasFailed(result)) return result;

    if (result[ImageFileType.MASTER] === undefined) {
      return Fail('No master file found');
    }

    return {
      [ImageFileType.MASTER]: result[ImageFileType.MASTER]!,
      [ImageFileType.ORIGINAL]: result[ImageFileType.ORIGINAL],
    };
  }

  // Util stuff ==================================================================

  private async getFullMimeFromBuffer(image: Buffer): AsyncFailable<FullMime> {
    const filetypeResult: FileTypeResult | undefined = await fileTypeFromBuffer(
      image,
    );

    let mime: string | undefined;
    if (filetypeResult === undefined) {
      if (IsQOI(image)) mime = 'image/qoi';
    } else {
      mime = filetypeResult.mime;
    }

    const fullMime = ParseMime(mime ?? 'other/unknown');
    return fullMime;
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
