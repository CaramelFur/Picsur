import { Injectable } from '@nestjs/common';
import { fileTypeFromBuffer, FileTypeResult } from 'file-type';
import { ImageEntity } from 'src/collections/imagedb/image.entity';
import { ImageDBService } from 'src/collections/imagedb/imagedb.service';
import { FullMime, MimesService } from 'src/collections/imagedb/mimes.service';
import { AsyncFailable, Fail, HasFailed } from 'src/types/failable';

@Injectable()
export class ImageManagerService {
  constructor(
    private readonly imagesService: ImageDBService,
    private readonly mimesService: MimesService,
  ) {}

  public async retrieve(hash: string): AsyncFailable<ImageEntity> {
    if (!this.validateHash(hash)) return Fail('Invalid hash');

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
    const mime: FileTypeResult = await fileTypeFromBuffer(image);
    const fullMime = await this.mimesService.getFullMime(
      mime?.mime ?? 'extra/discard',
    );
    return fullMime;
  }

  public validateHash(hash: string): boolean {
    return /^[a-f0-9]{64}$/.test(hash);
  }
}
