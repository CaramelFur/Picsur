import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { IsQOI } from 'qoi-img';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageProcessorService } from './image-processor.service';

// Right now this service is mostly a wrapper for the imagedbservice.
// But in the future the actual image logic will happend here
// And the image storing part will stay in the imagedbservice

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly processService: ImageProcessorService,
  ) {}

  public async retrieveInfo(id: string): AsyncFailable<EImageBackend> {
    return await this.imagesService.findOne(id);
  }

  // Image data buffer is not included by default, this also returns that buffer
  // Dont send to client, keep in backend
  public async retrieveComplete(
    id: string,
  ): AsyncFailable<Required<EImageBackend>> {
    return await this.imagesService.findOne(id, true);
  }

  public async upload(
    image: Buffer,
    userid: string,
  ): AsyncFailable<EImageBackend> {
    const fullMime = await this.getFullMimeFromBuffer(image);
    if (HasFailed(fullMime)) return fullMime;

    const processedImage = await this.processService.process(
      image,
      fullMime,
      userid,
    );
    if (HasFailed(processedImage)) return processedImage;

    const imageEntity = await this.imagesService.create(
      processedImage,
      fullMime.mime,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    return imageEntity;
  }

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
