import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import Crypto from 'crypto';
import { SupportedMime } from './mimes.service';
import { AsyncFailable, Fail, HasFailed, HasSuccess } from 'imagur-shared/dist/types';

@Injectable()
export class ImageDBService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  public async create(
    image: Buffer,
    type: SupportedMime,
  ): AsyncFailable<ImageEntity> {
    const hash = this.hash(image);
    const find = await this.findOne(hash);
    if (HasSuccess(find)) return find;

    const imageEntity = new ImageEntity();
    imageEntity.data = image;
    imageEntity.mime = type;
    imageEntity.hash = hash;
    try {
      await this.imageRepository.save(imageEntity);
    } catch (e: any) {
      return Fail(e?.message);
    }

    return imageEntity;
  }

  public async findOne(hash: string): AsyncFailable<ImageEntity> {
    try {
      const found = await this.imageRepository.findOne({ where: { hash } });
      if (found === undefined) return Fail('Image not found');
      return found;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findMany(
    startId: number,
    limit: number,
  ): AsyncFailable<ImageEntity[]> {
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

  private hash(image: Buffer): string {
    return Crypto.createHash('sha256').update(image).digest('hex');
  }
}
