import { Module } from '@nestjs/common';
import { ImageDBModule } from 'src/collections/imagedb/imagedb.module';
import { SafeImagesService } from './safeimages.service';

@Module({
  imports: [ImageDBModule],
  providers: [SafeImagesService],
  exports: [SafeImagesService],
})
export class SafeImagesModule {}
