import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail, FT } from 'picsur-shared/dist/types';
import { FindResult } from 'picsur-shared/dist/types/find-result';
import { In, Repository } from 'typeorm';
import { EImageDerivativeBackend } from '../../database/entities/image-derivative.entity';
import { EImageFileBackend } from '../../database/entities/image-file.entity';
import { EImageBackend } from '../../database/entities/image.entity';

@Injectable()
export class ImageDBService {
  constructor(
    @InjectRepository(EImageBackend)
    private readonly imageRepo: Repository<EImageBackend>,

    @InjectRepository(EImageFileBackend)
    private readonly imageFileRepo: Repository<EImageFileBackend>,

    @InjectRepository(EImageDerivativeBackend)
    private readonly imageDerivativeRepo: Repository<EImageDerivativeBackend>,
  ) {}

  public async create(userid: string): AsyncFailable<EImageBackend> {
    let imageEntity = new EImageBackend();
    imageEntity.user_id = userid;
    imageEntity.created = new Date();

    try {
      imageEntity = await this.imageRepo.save(imageEntity, { reload: true });
    } catch (e) {
      return Fail(FT.Database, e);
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

      if (!found) return Fail(FT.NotFound, 'Image not found');
      return found;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async findMany(
    count: number,
    page: number,
    userid: string | undefined,
  ): AsyncFailable<FindResult<EImageBackend>> {
    if (count < 1 || page < 0) return Fail(FT.UsrValidation, 'Invalid page');
    if (count > 100) return Fail(FT.UsrValidation, 'Too many results');

    try {
      const [found, amount] = await this.imageRepo.findAndCount({
        skip: count * page,
        take: count,
        where: {
          user_id: userid,
        },
      });

      if (found === undefined) return Fail(FT.NotFound, 'Images not found');

      return {
        results: found,
        total: amount,
        page,
        pages: Math.ceil(amount / count),
      };
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async delete(
    ids: string[],
    userid: string | undefined,
  ): AsyncFailable<EImageBackend[]> {
    if (ids.length === 0) return [];
    if (ids.length > 500) return Fail(FT.UsrValidation, 'Too many results');

    try {
      const deletable_images = await this.imageRepo.find({
        where: {
          id: In(ids),
          user_id: userid,
        },
      });

      const available_ids = deletable_images.map((i) => i.id);

      if (available_ids.length === 0) return Fail(FT.NotFound, 'Images not found');

      await Promise.all([
        this.imageDerivativeRepo.delete({
          image_id: In(available_ids),
        }),
        this.imageFileRepo.delete({
          image_id: In(available_ids),
        }),

        this.imageRepo.delete({ id: In(available_ids) }),
      ]);

      return deletable_images;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async deleteAll(IAmSure: boolean): AsyncFailable<true> {
    if (!IAmSure)
      return Fail(FT.SysValidation, 'You must confirm that you want to delete all images');

    try {
      await this.imageDerivativeRepo.delete({});
      await this.imageFileRepo.delete({});
      await this.imageRepo.delete({});
    } catch (e) {
      return Fail(FT.Database, e);
    }
    return true;
  }
}
