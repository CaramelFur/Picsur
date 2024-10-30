import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import {
    AsyncFailable,
    Fail,
    FT,
    HasFailed,
} from 'picsur-shared/dist/types/failable';
import { LessThan, Repository } from 'typeorm';
import { EImageDerivativeBackend } from '../../database/entities/images/image-derivative.entity.js';
import { EImageFileBackend } from '../../database/entities/images/image-file.entity.js';

const A_DAY_IN_SECONDS = 24 * 60 * 60;

@Injectable()
export class ImageFileDBService {
  constructor(
    @InjectRepository(EImageFileBackend)
    private readonly imageFileRepo: Repository<EImageFileBackend>,

    @InjectRepository(EImageDerivativeBackend)
    private readonly imageDerivativeRepo: Repository<EImageDerivativeBackend>,
  ) {}

  public async setFile(
    imageId: string,
    variant: ImageEntryVariant,
    file: Buffer,
    filetype: string,
  ): AsyncFailable<true> {
    const imageFile = new EImageFileBackend();
    imageFile.image_id = imageId;
    imageFile.variant = variant;
    imageFile.filetype = filetype;
    imageFile.data = file;

    try {
      await this.imageFileRepo.upsert(imageFile, {
        conflictPaths: ['image_id', 'variant'],
      });
    } catch (e) {
      return Fail(FT.Database, e);
    }

    return true;
  }

  public async getFile(
    imageId: string,
    variant: ImageEntryVariant,
  ): AsyncFailable<EImageFileBackend> {
    try {
      const found = await this.imageFileRepo.findOne({
        where: { image_id: imageId ?? '', variant: variant ?? '' },
      });

      if (!found) return Fail(FT.NotFound, 'Image not found');
      return found;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async migrateFile(
    imageId: string,
    sourceVariant: ImageEntryVariant,
    targetVariant: ImageEntryVariant,
  ): AsyncFailable<EImageFileBackend> {
    try {
      const sourceFile = await this.getFile(imageId, sourceVariant);
      if (HasFailed(sourceFile)) return sourceFile;

      sourceFile.variant = targetVariant;
      return await this.imageFileRepo.save(sourceFile);
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async deleteFile(
    imageId: string,
    variant: ImageEntryVariant,
  ): AsyncFailable<EImageFileBackend> {
    try {
      const found = await this.imageFileRepo.findOne({
        where: { image_id: imageId, variant: variant },
      });

      if (!found) return Fail(FT.NotFound, 'Image not found');

      await this.imageFileRepo.delete({ image_id: imageId, variant: variant });
      return found;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  // This is useful because you dont have to pull the whole image file
  public async getFileTypes(
    imageId: string,
  ): AsyncFailable<{ [key in ImageEntryVariant]?: string }> {
    try {
      const found = await this.imageFileRepo.find({
        where: { image_id: imageId },
        select: ['variant', 'filetype'],
      });

      if (!found) return Fail(FT.NotFound, 'Image not found');

      const result: { [key in ImageEntryVariant]?: string } = {};
      for (const file of found) {
        result[file.variant] = file.filetype;
      }

      return result;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async addDerivative(
    imageId: string,
    key: string,
    filetype: string,
    file: Buffer,
  ): AsyncFailable<EImageDerivativeBackend> {
    const imageDerivative = new EImageDerivativeBackend();
    imageDerivative.image_id = imageId;
    imageDerivative.key = key;
    imageDerivative.filetype = filetype;
    imageDerivative.data = file;
    imageDerivative.last_read = new Date();

    try {
      return await this.imageDerivativeRepo.save(imageDerivative);
    } catch (e) {
      return Fail(FT.Database, e);
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
      return Fail(FT.Database, e);
    }
  }

  public async cleanupDerivatives(
    olderThanSeconds: number,
  ): AsyncFailable<number> {
    try {
      const result = await this.imageDerivativeRepo.delete({
        last_read: LessThan(new Date(Date.now() - olderThanSeconds * 1000)),
      });

      return result.affected ?? 0;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }
}
