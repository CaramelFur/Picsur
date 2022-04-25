import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageFileType } from 'picsur-shared/dist/dto/image-file-types.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { In, LessThan, Repository } from 'typeorm';
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

  public async getFileMime(
    imageId: string,
    type: ImageFileType,
  ): AsyncFailable<string> {
    try {
      const found = await this.imageFileRepo.findOne({
        where: { image_id: imageId, type },
        select: ['mime'],
      });

      if (!found) return Fail('Image not found');
      return found.mime;
    } catch (e) {
      return Fail(e);
    }
  }

  public async getFileMimes(
    imageId: string,
    types: ImageFileType[],
  ): AsyncFailable<{ [key: string]: string | undefined }> {
    try {
      const found = await this.imageFileRepo.find({
        where: { image_id: imageId, type: In(types) },
        select: ['type', 'mime'],
      });

      if (!found) return Fail('Image not found');
      return Object.fromEntries(
        types.map((type) => [
          type,
          found.find((f) => f.type === type)?.mime,
        ]),
      );
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
    imageDerivative.last_read_unix_sec = Math.floor(Date.now() / 1000);

    try {
      return await this.imageDerivativeRepo.save(imageDerivative);
    } catch (e) {
      return Fail(e);
    }
  }

  public async getDerivative(
    imageId: string,
    key: string,
  ): AsyncFailable<EImageDerivativeBackend | null> {
    try {
      const derivative = await this.imageDerivativeRepo.findOne({
        where: { image_id: imageId, key },
      });
      if (!derivative) return null;

      const unix_seconds = Math.floor(Date.now() / 1000);
      if (derivative.last_read_unix_sec > unix_seconds - A_DAY_IN_SECONDS) {
        derivative.last_read_unix_sec = unix_seconds;
        return await this.imageDerivativeRepo.save(derivative);
      }

      return derivative;
    } catch (e) {
      return Fail(e);
    }
  }

  public async getDerivativeMime(
    imageId: string,
    key: string,
  ): AsyncFailable<string> {
    try {
      const found = await this.imageDerivativeRepo.findOne({
        where: { image_id: imageId, key },
        select: ['mime'],
      });

      if (!found) return Fail('Image not found');
      return found.mime;
    } catch (e) {
      return Fail(e);
    }
  }

  public async cleanupDerivatives(
    olderThanSeconds: number,
  ): AsyncFailable<number> {
    try {
      const unix_seconds = Math.floor(Date.now() / 1000);
      const result = await this.imageDerivativeRepo.delete({
        last_read_unix_sec: LessThan(unix_seconds - olderThanSeconds),
      });

      return result.affected ?? 0;
    } catch (e) {
      return Fail(e);
    }
  }
}
