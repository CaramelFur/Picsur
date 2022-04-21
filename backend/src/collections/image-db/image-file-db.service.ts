import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { ImageFileType } from '../../models/constants/image-file-types.const';
import { EImageFileBackend } from '../../models/entities/image-file.entity';

@Injectable()
export class ImageFileDBService {
  constructor(
    @InjectRepository(EImageFileBackend)
    private imageFileRepo: Repository<EImageFileBackend>,
  ) {}

  public async setSingle(
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
      await this.imageFileRepo.save(imageFile);
    } catch (e) {
      return Fail(e);
    }

    return true;
  }

  public async getSingle(
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

  public async getSingleMime(
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
}
