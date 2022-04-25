import { Module } from '@nestjs/common';
import { ImageDBModule } from '../../collections/image-db/image-db.module';
import { PreferenceModule } from '../../collections/preference-db/preference-db.module';
import { ImageConverterService } from './image-converter.service';
import { ImageProcessorService } from './image-processor.service';
import { ImageManagerService } from './image.service';

@Module({
  imports: [ImageDBModule, PreferenceModule],
  providers: [
    ImageManagerService,
    ImageProcessorService,
    ImageConverterService,
  ],
  exports: [ImageManagerService],
})
export class ImageManagerModule {}
