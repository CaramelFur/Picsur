import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { ImageEntity } from 'src/images/image.entity';
import { ImagesService } from 'src/images/images.service';
import { FullMime, MimesService } from 'src/images/mimes.service';
import { AsyncFailable, Fail, HasFailed } from 'src/lib/maybe';

@Injectable()
export class SafeImagesService {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly mimesService: MimesService,
  ) {}

  async uploadImage(image: Buffer): AsyncFailable<string> {
    const { mime } = await fileTypeFromBuffer(image);
    const fullMime = await this.mimesService.getFullMime(mime);
    if (HasFailed(fullMime)) return fullMime;

    const processedImage: Buffer = await this.processImage(image, fullMime);

    const imageEntity = await this.imagesService.create(
      processedImage,
      fullMime.mime,
    );
    if (HasFailed(imageEntity)) return imageEntity;

    return imageEntity.hash;
  }

  private async processImage(image: Buffer, mime: FullMime): Promise<Buffer> {
    return image;
  }

  async retrieveImage(hash: string): AsyncFailable<ImageEntity> {
    if (!this.validateHash(hash)) return Fail('Invalid hash');

    return await this.imagesService.findOne(hash);
  }

  validateHash(hash: string): boolean {
    return /^[a-f0-9]{64}$/.test(hash);
  }
}
