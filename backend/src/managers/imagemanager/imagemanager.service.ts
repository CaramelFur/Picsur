import { Injectable } from '@nestjs/common';
import { isHash } from 'class-validator';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { FullMime } from 'picsur-shared/dist/dto/mimes.dto';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { ImageDBService } from '../../collections/imagedb/imagedb.service';
import { MimesService } from '../../collections/imagedb/mimes.service';

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly mimesService: MimesService,
  ) {}

  public async retrieveInfo(hash: string): AsyncFailable<EImage> {
    return await this.imagesService.findOne(hash);
  }

  // Image data buffer is not included by default, this also returns that buffer
  public async retrieveComplete(hash: string): AsyncFailable<Required<EImage>> {
    return await this.imagesService.findOne(hash, true);
  }

  public async upload(image: Buffer): AsyncFailable<EImage> {
    const fullMime = await this.getFullMimeFromBuffer(image);
    if (HasFailed(fullMime)) return fullMime;

    const processedImage: Buffer = await this.process(image, fullMime);

    const imageEntity = await this.imagesService.create(
      processedImage,
      fullMime.mime,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    return imageEntity;
  }

  private async process(image: Buffer, mime: FullMime): Promise<Buffer> {
    return image;
  }

  private async getFullMimeFromBuffer(image: Buffer): AsyncFailable<FullMime> {
    const mime: FileTypeResult | undefined = await fileTypeFromBuffer(image);
    const fullMime = await this.mimesService.getFullMime(
      mime?.mime ?? 'extra/discard',
    );
    return fullMime;
  }
}
