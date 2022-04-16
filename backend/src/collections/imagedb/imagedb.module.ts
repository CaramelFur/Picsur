import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageDBService } from './imagedb.service';

@Module({
  imports: [TypeOrmModule.forFeature([EImageBackend])],
  providers: [ImageDBService],
  exports: [ImageDBService],
})
export class ImageDBModule {}
