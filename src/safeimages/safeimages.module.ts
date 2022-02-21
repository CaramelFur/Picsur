import { Module } from '@nestjs/common';
import { ImagesModule } from 'src/images/images.module';
import { SafeImagesService } from './safeimages.service';

@Module({
  imports: [ImagesModule],
  providers: [SafeImagesService],
  exports: [SafeImagesService],
})
export class SafeImagesModule {}
