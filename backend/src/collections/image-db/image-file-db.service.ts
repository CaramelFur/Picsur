import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { ImageFileType } from '../../models/constants/image-file-types.const';
import { EImageDerivativeBackend } from '../../models/entities/image-derivative.entity';
import { EImageFileBackend } from '../../models/entities/image-file.entity';

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
    imageFile.imageId = imageId;
    imageFile.type = type;
    imageFile.mime = mime;
    imageFile.data = file;

    try {
      await this.imageFileRepo.upsert(imageFile, {
        conflictPaths: ['imageId', 'type'],
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
        where: { imageId, type },
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
        where: { imageId, type },
        select: ['mime'],
      });

      if (!found) return Fail('Image not found');
      return found.mime;
    } catch (e) {
      return Fail(e);
    }
  }

  public async addDerivative(
    imageId: string,
    key: string,
    mime: string,
    file: Buffer,
  ): AsyncFailable<true> {
    const imageDerivative = new EImageDerivativeBackend();
    imageDerivative.imageId = imageId;
    imageDerivative.key = key;
    imageDerivative.mime = mime;
    imageDerivative.data = file;

    try {
      await this.imageDerivativeRepo.save(imageDerivative);
    } catch (e) {
      return Fail(e);
    }

    return true;
  }

  public async getDerivative(
    imageId: string,
    key: string,
  ): AsyncFailable<EImageDerivativeBackend> {
    try {
      const found = await this.imageDerivativeRepo.findOne({
        where: { imageId, key },
      });

      if (!found) return Fail('Image not found');
      return found;
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
        where: { imageId, key },
        select: ['mime'],
      });

      if (!found) return Fail('Image not found');
      return found.mime;
    } catch (e) {
      return Fail(e);
    }
  }
}
