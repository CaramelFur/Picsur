import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EImageDerivativeBackend } from '../../database/entities/image-derivative.entity';
import { EImageFileBackend } from '../../database/entities/image-file.entity';
import { EImageBackend } from '../../database/entities/image.entity';
import { ImageDBService } from './image-db.service';
import { ImageFileDBService } from './image-file-db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EImageBackend,
      EImageFileBackend,
      EImageDerivativeBackend,
    ]),
  ],
  providers: [ImageDBService, ImageFileDBService],
  exports: [ImageDBService, ImageFileDBService],
})
export class ImageDBModule {}
