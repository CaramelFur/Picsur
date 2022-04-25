import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { EImageDerivativeBackend } from '../../models/entities/image-derivative.entity';
import { EImageFileBackend } from '../../models/entities/image-file.entity';
import { EImageBackend } from '../../models/entities/image.entity';

@Injectable()
export class ImageDBService {
  constructor(
    @InjectRepository(EImageBackend)
    private imageRepo: Repository<EImageBackend>,

    @InjectRepository(EImageFileBackend)
    private imageFileRepo: Repository<EImageFileBackend>,

    @InjectRepository(EImageDerivativeBackend)
    private imageDerivativeRepo: Repository<EImageDerivativeBackend>,
  ) {}

  public async create(): AsyncFailable<EImageBackend> {
    let imageEntity = new EImageBackend();

    try {
      imageEntity = await this.imageRepo.save(imageEntity);
    } catch (e) {
      return Fail(e);
    }

    return imageEntity;
  }

  public async findOne(id: string): AsyncFailable<EImageBackend> {
    try {
      const found = await this.imageRepo.findOne({
        where: { id },
      });

      if (!found) return Fail('Image not found');
      return found;
    } catch (e) {
      return Fail(e);
    }
  }

  public async findMany(
    count: number,
    page: number,
  ): AsyncFailable<EImageBackend[]> {
    if (count < 1 || page < 0) return Fail('Invalid page');
    if (count > 100) return Fail('Too many results');

    try {
      const found = await this.imageRepo.find({
        skip: count * page,
        take: count,
      });

      if (found === undefined) return Fail('Images not found');
      return found;
    } catch (e) {
      return Fail(e);
    }
  }

  public async delete(id: string): AsyncFailable<true> {
    try {
      const derivativesResult = await this.imageDerivativeRepo.delete({
        image_id: id,
      });
      const filesResult = await this.imageFileRepo.delete({
        image_id: id,
      });
      const result = await this.imageRepo.delete({ id });

      if (
        result.affected === 0 &&
        filesResult.affected === 0 &&
        derivativesResult.affected === 0
      )
        return Fail('Image not found');
    } catch (e) {
      return Fail(e);
    }
    return true;
  }

  public async deleteAll(IAmSure: boolean): AsyncFailable<true> {
    if (!IAmSure)
      return Fail('You must confirm that you want to delete all images');

    try {
      await this.imageDerivativeRepo.delete({});
      await this.imageFileRepo.delete({});
      await this.imageRepo.delete({});
    } catch (e) {
      return Fail(e);
    }
    return true;
  }
}
