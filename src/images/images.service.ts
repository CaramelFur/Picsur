import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './image.entity';
import Crypto from 'crypto';
import { AsyncFailable, Fail, HasFailed, HasSuccess } from 'src/lib/maybe';
import { SupportedMime } from './mimes.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  async create(image: Buffer, type: SupportedMime): AsyncFailable<ImageEntity> {
    const hash = this.hash(image);
    const find = await this.findOne(hash);
    if (HasSuccess(find)) return find;

    const imageEntity = new ImageEntity();
    imageEntity.data = image;
    imageEntity.mime = type;
    imageEntity.hash = hash;
    try {
      await this.imageRepository.save(imageEntity);
    } catch (e) {
      return Fail(e.message);
    }

    return imageEntity;
  }

  async findOne(hash: string): AsyncFailable<ImageEntity> {
    const found = await this.imageRepository.findOne({ where: { hash } });
    if (found === undefined) return Fail('Image not found');
    return found;
  }

  async delete(hash: string): AsyncFailable<true> {
    const image = await this.findOne(hash);

    if (HasFailed(image)) return image;

    try {
      await this.imageRepository.delete(image);
    } catch (e) {
      return Fail(e.message);
    }
    return true;
  }

  hash(image: Buffer): string {
    return Crypto.createHash('sha256').update(image).digest('hex');
  }
}
