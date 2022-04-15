import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ImageDBService } from '../../collections/imagedb/imagedb.service';
import { MimesService } from '../../collections/imagedb/mimes.service';
import { FullMime } from '../../models/dto/mimes.dto';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageProcessorService } from './imageprocessor.service';

// Right now this service is mostly a wrapper for the imagedbservice.
// But in the future the actual image logic will happend here
// And the image storing part will stay in the imagedbservice

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly mimesService: MimesService,
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
    const mime: FileTypeResult | undefined = await fileTypeFromBuffer(image);
    const fullMime = await this.mimesService.getFullMime(
      mime?.mime ?? 'extra/discard',
    );
    return fullMime;
  }
}
