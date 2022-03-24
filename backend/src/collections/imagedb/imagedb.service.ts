import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import Crypto from 'crypto';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess
} from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { SupportedMime } from '../../models/dto/mimes.dto';
import { EImageBackend } from '../../models/entities/image.entity';
import { GetCols } from '../collectionutils';

@Injectable()
export class ImageDBService {
  constructor(
    @InjectRepository(EImageBackend)
    private imageRepository: Repository<EImageBackend>,
  ) {}

  public async create(
    image: Buffer,
    type: SupportedMime,
  ): AsyncFailable<EImageBackend> {
    const hash = this.hash(image);
    const find = await this.findOne(hash);
    if (HasSuccess(find)) return find;

    let imageEntity = new EImageBackend();
    imageEntity.data = image;
    imageEntity.mime = type;
    imageEntity.hash = hash;

    try {
      imageEntity = await this.imageRepository.save(imageEntity);
    } catch (e: any) {
      return Fail(e?.message);
    }

    // Strips unwanted data
    return plainToClass(EImageBackend, imageEntity);
  }

  public async findOne<B extends true | undefined = undefined>(
    hash: string,
    getPrivate?: B,
  ): AsyncFailable<B extends undefined ? EImageBackend : Required<EImageBackend>> {
    try {
      const found = await this.imageRepository.findOne({
        where: { hash },
        select: getPrivate ? GetCols(this.imageRepository) : undefined,
      });

      if (!found) return Fail('Image not found');
      return found as B extends undefined ? EImageBackend : Required<EImageBackend>;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findMany(
    startId: number,
    limit: number,
  ): AsyncFailable<EImageBackend[]> {
    try {
      const found = await this.imageRepository.find({
        where: { id: { gte: startId } },
        take: limit,
      });
      if (found === undefined) return Fail('Images not found');
      return found;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async delete(hash: string): AsyncFailable<true> {
    const image = await this.findOne(hash);
    if (HasFailed(image)) return image;

    try {
      await this.imageRepository.delete(image);
    } catch (e: any) {
      return Fail(e?.message);
    }
    return true;
  }

  public async deleteAll(): AsyncFailable<true> {
    try {
      await this.imageRepository.delete({});
    } catch (e: any) {
      return Fail(e?.message);
    }
    return true;
  }

  private hash(image: Buffer): string {
    return Crypto.createHash('sha256').update(image).digest('hex');
  }
}
