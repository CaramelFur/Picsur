import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { UsrPreference } from 'picsur-shared/dist/dto/usr-preferences.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { IsQOI } from 'qoi-img';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { UsrPreferenceService } from '../../collections/preference-db/usr-preference-db.service';
import { ImageFileType } from '../../models/constants/image-file-types.const';
import { EImageDerivativeBackend } from '../../models/entities/image-derivative.entity';
import { EImageFileBackend } from '../../models/entities/image-file.entity';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageConverterService } from './image-converter.service';
import { ImageProcessorService } from './image-processor.service';

// Right now this service is mostly a wrapper for the imagedbservice.
// But in the future the actual image logic will happend here
// And the image storing part will stay in the imagedbservice

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly imageFilesService: ImageFileDBService,
    private readonly processService: ImageProcessorService,
    private readonly convertService: ImageConverterService,
    private readonly userPref: UsrPreferenceService,
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
  ): AsyncFailable<EImageDerivativeBackend> {
    const targetMime = ParseMime(mime);
    if (HasFailed(targetMime)) return targetMime;
    
    const masterImage = await this.getMaster(imageId);
    if (HasFailed(masterImage)) return masterImage;

    const sourceMime = ParseMime(masterImage.mime);
    if (HasFailed(sourceMime)) return sourceMime;

    const convertResult = await this.convertService.convert(
      masterImage.data,
      sourceMime,
      targetMime,
    );
    if (HasFailed(convertResult)) return convertResult;

    const returned = new EImageDerivativeBackend();
    returned.data = convertResult.image;
    returned.mime = convertResult.mime;
    returned.imageId = imageId;
    returned.key = 'aight';

    return returned;
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
}
