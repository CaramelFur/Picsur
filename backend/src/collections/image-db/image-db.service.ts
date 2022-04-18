import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AsyncFailable,
  Fail
} from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { EImageBackend } from '../../models/entities/image.entity';
import { GetCols } from '../../models/util/collection';

@Injectable()
export class ImageDBService {
  constructor(
    @InjectRepository(EImageBackend)
    private imageRepository: Repository<EImageBackend>,
  ) {}

  public async create(
    image: Buffer,
    type: string,
  ): AsyncFailable<EImageBackend> {
    let imageEntity = new EImageBackend();
    imageEntity.data = image;
    imageEntity.mime = type;

    try {
      imageEntity = await this.imageRepository.save(imageEntity);
    } catch (e) {
      return Fail(e);
    }

    return imageEntity;
  }

  public async findOne<B extends true | undefined = undefined>(
    id: string,
    getPrivate?: B,
  ): AsyncFailable<
    B extends undefined ? EImageBackend : Required<EImageBackend>
  > {
    try {
      const found = await this.imageRepository.findOne({
        where: { id },
        select: getPrivate ? GetCols(this.imageRepository) : undefined,
      });

      if (!found) return Fail('Image not found');
      return found as B extends undefined
        ? EImageBackend
        : Required<EImageBackend>;
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
      const found = await this.imageRepository.find({
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
      const result = await this.imageRepository.delete({ id });
      if (result.affected === 0) return Fail('Image not found');
    } catch (e) {
      return Fail(e);
    }
    return true;
  }

  public async deleteAll(IAmSure: boolean): AsyncFailable<true> {
    if (!IAmSure)
      return Fail('You must confirm that you want to delete all images');

    try {
      await this.imageRepository.delete({});
    } catch (e) {
      return Fail(e);
    }
    return true;
  }
}
