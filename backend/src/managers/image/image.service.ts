import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { IsQOI } from 'qoi-img';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { ImageFileDBService } from '../../collections/image-db/image-file-db.service';
import { ImageFileType } from '../../models/constants/image-file-types.const';
import { EImageFileBackend } from '../../models/entities/image-file.entity';
import { EImageBackend } from '../../models/entities/image.entity';
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

    const processResult = await this.processService.process(
      image,
      fullMime,
      userid,
    );
    if (HasFailed(processResult)) return processResult;

    const imageEntity = await this.imagesService.create();
    if (HasFailed(imageEntity)) return imageEntity;

    const imageFileEntity = await this.imageFilesService.setSingle(
      imageEntity.id,
      ImageFileType.MASTER,
      processResult.image,
      processResult.mime,
    );
    if (HasFailed(imageFileEntity)) return imageFileEntity;

    // // nothing happens right now
    // const keepOriginal = await this.userPref.getBooleanPreference(
    //   userid,
    //   UsrPreference.KeepOriginal,
    // );
    // if (HasFailed(keepOriginal)) return keepOriginal;

    // if (keepOriginal) {
    // }

    return imageEntity;
  }

  // File getters ==============================================================

  public async getMaster(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getSingle(imageId, ImageFileType.MASTER);
  }

  public async getMasterMime(imageId: string): AsyncFailable<FullMime> {
    const mime = await this.imageFilesService.getSingleMime(
      imageId,
      ImageFileType.MASTER,
    );
    if (HasFailed(mime)) return mime;

    return ParseMime(mime);
  }

  public async getOriginal(imageId: string): AsyncFailable<EImageFileBackend> {
    return this.imageFilesService.getSingle(imageId, ImageFileType.ORIGINAL);
  }

  public async getOriginalMime(imageId: string): AsyncFailable<FullMime> {
    const mime = await this.imageFilesService.getSingleMime(
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
