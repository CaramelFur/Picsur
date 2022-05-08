import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { FindResult } from 'picsur-shared/dist/types/find-result';
import { In, Repository } from 'typeorm';
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

  public async create(userid: string): AsyncFailable<EImageBackend> {
    let imageEntity = new EImageBackend();
    imageEntity.user_id = userid;
    imageEntity.created = new Date();

    try {
      imageEntity = await this.imageRepo.save(imageEntity, { reload: true });
    } catch (e) {
      return Fail(e);
    }

    return imageEntity;
  }

  public async findOne(
    id: string,
    userid: string | undefined,
  ): AsyncFailable<EImageBackend> {
    try {
      const found = await this.imageRepo.findOne({
        where: { id, user_id: userid },
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
    userid: string | undefined,
  ): AsyncFailable<FindResult<EImageBackend>> {
    if (count < 1 || page < 0) return Fail('Invalid page');
    if (count > 100) return Fail('Too many results');

    try {
      const [found, amount] = await this.imageRepo.findAndCount({
        skip: count * page,
        take: count,
        where: {
          user_id: userid,
        },
      });

      if (found === undefined) return Fail('Images not found');
      
      return {
        results: found,
        totalResults: amount,
        page,
        pages: Math.ceil(amount / count),
      };
    } catch (e) {
      return Fail(e);
    }
  }

  public async findList(
    ids: string[],
    userid: string | undefined,
  ): AsyncFailable<EImageBackend[]> {
    if (ids.length === 0) return [];
    if (ids.length > 500) return Fail('Too many results');

    try {
      const found = await this.imageRepo.find({
        where: {
          id: In(ids),
          user_id: userid,
        },
      });

      if (found === undefined) return Fail('Images not found');
      return found;
    } catch (e) {
      return Fail(e);
    }
  }

  public async delete(ids: string[]): AsyncFailable<true> {
    if (ids.length === 0) return true;
    if (ids.length > 500) return Fail('Too many results');

    try {
      const derivativesResult = await this.imageDerivativeRepo.delete({
        image_id: In(ids),
      });
      const filesResult = await this.imageFileRepo.delete({
        image_id: In(ids),
      });
      const result = await this.imageRepo.delete({ id: In(ids) });

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
