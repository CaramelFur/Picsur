import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { In, IsNull, LessThan, Not, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EImageDerivativeBackend } from '../../database/entities/images/image-derivative.entity';
import { EImageFileBackend } from '../../database/entities/images/image-file.entity';
import { FileStorageGeneric } from '../filestorage-db/filestorage-generic.service';

const A_DAY_IN_SECONDS = 24 * 60 * 60;

@Injectable()
export class ImageFileDBService {
  constructor(
    @InjectRepository(EImageFileBackend)
    private readonly imageFileRepo: Repository<EImageFileBackend>,

    @InjectRepository(EImageDerivativeBackend)
    private readonly imageDerivativeRepo: Repository<EImageDerivativeBackend>,

    private readonly fsService: FileStorageGeneric,
  ) {}

  public async getFileData(
    file: EImageFileBackend | EImageDerivativeBackend,
  ): AsyncFailable<Buffer> {
    if (file.data !== null) {
      // Migrate files from old format to s3
      const data = file.data;

      const s3result = await this.fsService.putFile(file.fileKey, data);
      if (HasFailed(s3result)) return s3result;

      file.data = null;
      let repoResult: EImageFileBackend | EImageDerivativeBackend;
      if (file instanceof EImageFileBackend) {
        repoResult = await this.imageFileRepo.save(file);
      } else if (file instanceof EImageDerivativeBackend) {
        repoResult = await this.imageDerivativeRepo.save(file);
      } else {
        return Fail(FT.SysValidation, 'Invalid file type');
      }
      if (HasFailed(repoResult)) return repoResult;

      return data;
    }

    const result = await this.fsService.getFile(file.fileKey);
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
    imageFile.fileKey = s3key;

    try {
      await this.imageFileRepo.upsert(imageFile, {
        conflictPaths: ['image_id', 'variant'],
      });

      const s3result = await this.fsService.putFile(s3key, file);
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

  public async deleteFile(
    imageId: string,
    variant: ImageEntryVariant,
  ): AsyncFailable<EImageFileBackend> {
    try {
      const found = await this.imageFileRepo.findOne({
        where: { image_id: imageId, variant: variant },
      });

      if (!found) return Fail(FT.NotFound, 'Image not found');

      const s3result = await this.fsService.deleteFile(found.fileKey);
      if (HasFailed(s3result)) return s3result;

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
    const s3key = uuidv4();

    const imageDerivative = new EImageDerivativeBackend();
    imageDerivative.image_id = imageId;
    imageDerivative.key = key;
    imageDerivative.filetype = filetype;
    imageDerivative.fileKey = s3key;
    imageDerivative.last_read = new Date();

    try {
      const result = await this.imageDerivativeRepo.save(imageDerivative);

      const s3result = await this.fsService.putFile(s3key, file);
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

  public async cleanupOrphanedDerivatives(): AsyncFailable<number> {
    return this.cleanupRepoWithFilekey(this.imageDerivativeRepo);
  }

  public async cleanupOrphanedFiles(): AsyncFailable<number> {
    return this.cleanupRepoWithFilekey(this.imageFileRepo);
  }

  // Go over all image files in the db, and any that are not linked to an image are deleted from s3 and the db
  private async cleanupRepoWithFilekey(
    repo: Repository<{ image_id: string | null; fileKey: string }>,
  ): AsyncFailable<number> {
    try {
      let remaining = Infinity;
      let processed = 0;

      while (remaining > 0) {
        const orphaned = await repo.findAndCount({
          where: {
            image_id: IsNull(),
          },
          select: ['fileKey'],
          take: 100,
        });
        if (orphaned[1] === 0) break;
        remaining = orphaned[1] - orphaned[0].length;

        const keys = orphaned[0].map((d) => d.fileKey);

        const s3result = await this.fsService.deleteFiles(keys);
        if (HasFailed(s3result)) return s3result;

        const result = await repo.delete({
          fileKey: In(keys),
        });

        processed += result.affected ?? 0;
      }

      return processed;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async migrateFilesToFilekey(): AsyncFailable<number> {
    return this.migrateRepoToFilekey(this.imageFileRepo);
  }

  public async migrateDerivativesToFilekey(): AsyncFailable<number> {
    return this.migrateRepoToFilekey(this.imageDerivativeRepo);
  }

  private async migrateRepoToFilekey(
    repo: Repository<EImageFileBackend | EImageDerivativeBackend>,
  ): AsyncFailable<number> {
    let processed = 0;

    try {
      while (true) {
        const current = await repo.findOne({
          where: {
            data: Not(IsNull()),
          },
        });
        if (!current) break;

        const result = await this.getFileData(current);
        if (HasFailed(result)) return result;

        processed++;
      }
    } catch (e) {
      return Fail(FT.Database, e);
    }

    return processed;
  }
}
