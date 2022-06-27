import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileType } from 'picsur-shared/dist/dto/image-file-types.enum';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { LessThan, Repository } from 'typeorm';
import { EImageDerivativeBackend } from '../../models/entities/image-derivative.entity';
import { EImageFileBackend } from '../../models/entities/image-file.entity';

const A_DAY_IN_SECONDS = 24 * 60 * 60;

@Injectable()
export class ImageFileDBService {
  constructor(
    @InjectRepository(EImageFileBackend)
    private imageFileRepo: Repository<EImageFileBackend>,

    @InjectRepository(EImageDerivativeBackend)
    private imageDerivativeRepo: Repository<EImageDerivativeBackend>,
  ) {}

  public async setFile(
    imageId: string,
    type: ImageFileType,
    file: Buffer,
    mime: string,
  ): AsyncFailable<true> {
    const imageFile = new EImageFileBackend();
    imageFile.image_id = imageId;
    imageFile.type = type;
    imageFile.mime = mime;
    imageFile.data = file;

    try {
      await this.imageFileRepo.upsert(imageFile, {
        conflictPaths: ['image_id', 'type'],
      });
    } catch (e) {
      return Fail(e);
    }

    return true;
  }

  public async getFile(
    imageId: string,
    type: ImageFileType,
  ): AsyncFailable<EImageFileBackend> {
    try {
      const found = await this.imageFileRepo.findOne({
        where: { image_id: imageId ?? '', type: type ?? '' },
      });

      if (!found) return Fail('Image not found');
      return found;
    } catch (e) {
      return Fail(e);
    }
  }

  // This is useful because you dont have to pull the whole image file
  public async getFileMimes(
    imageId: string,
  ): AsyncFailable<{ [key in ImageFileType]?: string }> {
    try {
      const found = await this.imageFileRepo.find({
        where: { image_id: imageId },
        select: ['type', 'mime'],
      });

      if (!found) return Fail('Image not found');
      
      const result: { [key in ImageFileType]?: string } = {};
      for (const file of found) {
        result[file.type] = file.mime;
      }

      return result;
    } catch (e) {
      return Fail(e);
    }
  }

  public async addDerivative(
    imageId: string,
    key: string,
    mime: string,
    file: Buffer,
  ): AsyncFailable<EImageDerivativeBackend> {
    const imageDerivative = new EImageDerivativeBackend();
    imageDerivative.image_id = imageId;
    imageDerivative.key = key;
    imageDerivative.mime = mime;
    imageDerivative.data = file;
    imageDerivative.last_read = new Date();

    try {
      return await this.imageDerivativeRepo.save(imageDerivative);
    } catch (e) {
      return Fail(e);
    }
  }

  // Returns null when derivative is not found
  public async getDerivative(
    imageId: string,
    key: string,
  ): AsyncFailable<EImageDerivativeBackend | null> {
    try {
      const derivative = await this.imageDerivativeRepo.findOne({
        where: { image_id: imageId, key },
      });
      if (!derivative) return null;

      // Ensure read time updated to within 1 day precision
      const yesterday = new Date(Date.now() - A_DAY_IN_SECONDS * 1000);
      if (derivative.last_read > yesterday) {
        derivative.last_read = new Date();
        return await this.imageDerivativeRepo.save(derivative);
      }

      return derivative;
    } catch (e) {
      return Fail(e);
    }
  }

  public async cleanupDerivatives(
    olderThanSeconds: number,
  ): AsyncFailable<number> {
    try {
      const result = await this.imageDerivativeRepo.delete({
        last_read: LessThan(new Date()),
      });

      return result.affected ?? 0;
    } catch (e) {
      return Fail(e);
    }
  }
}
