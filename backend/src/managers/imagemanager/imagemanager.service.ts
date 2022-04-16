import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ParseMime } from 'picsur-shared/dist/util/parse-mime';
import { ImageDBService } from '../../collections/imagedb/imagedb.service';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageProcessorService } from './imageprocessor.service';

// Right now this service is mostly a wrapper for the imagedbservice.
// But in the future the actual image logic will happend here
// And the image storing part will stay in the imagedbservice

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly processService: ImageProcessorService,
  ) {}

  public async retrieveInfo(hash: string): AsyncFailable<EImageBackend> {
    return await this.imagesService.findOne(hash);
  }

  // Image data buffer is not included by default, this also returns that buffer
  // Dont send to client, keep in backend
  public async retrieveComplete(
    hash: string,
  ): AsyncFailable<Required<EImageBackend>> {
    return await this.imagesService.findOne(hash, true);
  }

  public async upload(
    image: Buffer,
    userid: string,
  ): AsyncFailable<EImageBackend> {
    let startTime = Date.now();

    console.log('Uploading image');

    const fullMime = await this.getFullMimeFromBuffer(image);
    if (HasFailed(fullMime)) return fullMime;

    console.log('Got full mime after ' + (Date.now() - startTime) + 'ms');
    startTime = Date.now();

    const processedImage = await this.processService.process(
      image,
      fullMime,
      userid,
    );
    if (HasFailed(processedImage)) return processedImage;

    console.log('Processed image after ' + (Date.now() - startTime) + 'ms');
    startTime = Date.now();

    const imageEntity = await this.imagesService.create(
      processedImage,
      fullMime.mime,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    console.log('Created image after ' + (Date.now() - startTime) + 'ms');

    return imageEntity;
  }

  private async getFullMimeFromBuffer(image: Buffer): AsyncFailable<FullMime> {
    const mime: FileTypeResult | undefined = await fileTypeFromBuffer(image);

    console.log(mime);

    const fullMime = ParseMime(mime?.mime ?? 'extra/discard');
    return fullMime;
  }
}
