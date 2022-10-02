import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EImageDerivativeBackend } from '../../database/entities/images/image-derivative.entity';
import { EImageFileBackend } from '../../database/entities/images/image-file.entity';
import { EImageBackend } from '../../database/entities/images/image.entity';
import { FileS3Module } from '../file-s3/file-s3.module';
import { ImageDBService } from './image-db.service';
import { ImageFileDBService } from './image-file-db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EImageBackend,
      EImageFileBackend,
      EImageDerivativeBackend,
    ]),
    FileS3Module,
  ],
  providers: [ImageDBService, ImageFileDBService],
  exports: [ImageDBService, ImageFileDBService],
})
export class ImageDBModule {}
