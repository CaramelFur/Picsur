import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { In, IsNull, LessThan, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EImageDerivativeBackend } from '../../database/entities/images/image-derivative.entity';
import { EImageFileBackend } from '../../database/entities/images/image-file.entity';
import { FileS3Service } from '../file-s3/file-s3.service';

const A_DAY_IN_SECONDS = 24 * 60 * 60;

@Injectable()
export class ImageFileDBService {
  private readonly logger = new Logger(ImageFileDBService.name);

  constructor(
    @InjectRepository(EImageFileBackend)
    private readonly imageFileRepo: Repository<EImageFileBackend>,

    @InjectRepository(EImageDerivativeBackend)
    private readonly imageDerivativeRepo: Repository<EImageDerivativeBackend>,

    private readonly s3Service: FileS3Service,
  ) {}

  public async getData(
    file: EImageFileBackend | EImageDerivativeBackend,
  ): AsyncFailable<Buffer> {
    const result = await this.s3Service.getFile(file.s3key);
    if (HasFailed(result)) return result;

    return result;
  }

  public async setFile(
    imageId: string,
    variant: ImageEntryVariant,
    file: Buffer,
    filetype: string,
  ): AsyncFailable<true> {
    const s3key = uuidv4();

    const imageFile = new EImageFileBackend();
    imageFile.image_id = imageId;
    imageFile.variant = variant;
    imageFile.filetype = filetype;
    imageFile.s3key = s3key;

    try {
      await this.imageFileRepo.upsert(imageFile, {
        conflictPaths: ['image_id', 'variant'],
      });

      const s3result = await this.s3Service.putFile(s3key, file);
      if (HasFailed(s3result)) return s3result;
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

  public async orphanFile(
    imageId: string,
    variant: ImageEntryVariant,
  ): AsyncFailable<EImageFileBackend> {
    try {
      const found = await this.imageFileRepo.findOne({
        where: { image_id: imageId, variant: variant },
      });

      if (!found) return Fail(FT.NotFound, 'Image not found');

      found.image_id = null;

      return await this.imageFileRepo.save(found);
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
    const s3key = uuidv4();

    const imageDerivative = new EImageDerivativeBackend();
    imageDerivative.image_id = imageId;
    imageDerivative.key = key;
    imageDerivative.filetype = filetype;
    imageDerivative.s3key = s3key;
    imageDerivative.last_read = new Date();

    try {
      const result = await this.imageDerivativeRepo.save(imageDerivative);

      const s3result = await this.s3Service.putFile(s3key, file);
      if (HasFailed(s3result)) return s3result;

      return result;
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
      const aMinuteAgo = new Date(Date.now() - 60 * 1000);
      if (derivative.last_read > aMinuteAgo) {
        derivative.last_read = new Date();
        this.imageDerivativeRepo.save(derivative).then((r) => {
          if (HasFailed(r)) r.print(this.logger);
        });
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

  public async cleanupOrphanedDerivatives(): AsyncFailable<number> {
    return this.cleanupRepoWithS3(this.imageDerivativeRepo);
  }

  public async cleanupOrphanedFiles(): AsyncFailable<number> {
    return this.cleanupRepoWithS3(this.imageFileRepo);
  }

  private async cleanupRepoWithS3(
    repo: Repository<{ image_id: string | null; s3key: string }>,
  ): AsyncFailable<number> {
    try {
      let remaining = Infinity;
      let processed = 0;
      while (remaining > 0) {
        const orphaned = await repo.findAndCount({
          where: {
            image_id: IsNull(),
          },
          select: ['s3key'],
          take: 100,
        });
        if (orphaned[1] === 0) break;
        remaining = orphaned[1] - orphaned[0].length;

        const keys = orphaned[0].map((d) => d.s3key);

        const s3result = await this.s3Service.deleteFiles(keys);
        if (HasFailed(s3result)) return s3result;

        const result = await repo.delete({
          s3key: In(keys),
        });

        processed += result.affected ?? 0;
      }

      return processed;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }
}
