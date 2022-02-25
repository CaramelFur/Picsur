import { Injectable } from '@nestjs/common';
import { isHash } from 'class-validator';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { AsyncFailable, Fail, HasFailed } from 'imagur-shared/dist/types';
import { ImageEntity } from '../../collections/imagedb/image.entity';
import { ImageDBService } from '../../collections/imagedb/imagedb.service';
import {
  MimesService,
  FullMime,
} from '../../collections/imagedb/mimes.service';

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly mimesService: MimesService,
  ) {}

  public async retrieve(hash: string): AsyncFailable<ImageEntity> {
    if (!isHash(hash, 'sha256')) return Fail('Invalid hash');

    return await this.imagesService.findOne(hash);
  }

  public async upload(image: Buffer): AsyncFailable<string> {
    const fullMime = await this.getFullMimeFromBuffer(image);
    if (HasFailed(fullMime)) return fullMime;

    const processedImage: Buffer = await this.process(image, fullMime);

    const imageEntity = await this.imagesService.create(
      processedImage,
      fullMime.mime,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    return imageEntity.hash;
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
