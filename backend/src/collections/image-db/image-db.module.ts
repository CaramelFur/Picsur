import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EImageFileBackend } from '../../models/entities/image-file.entity';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageDBService } from './image-db.service';
import { ImageFileDBService } from './image-file-db.service';

@Module({
  imports: [TypeOrmModule.forFeature([EImageBackend, EImageFileBackend])],
  providers: [ImageDBService, ImageFileDBService],
  exports: [ImageDBService, ImageFileDBService],
})
export class ImageDBModule {}
