import { Module } from '@nestjs/common';
import { ImageDBModule } from '../../collections/imagedb/imagedb.module';
import { PreferenceModule } from '../../collections/preferencesdb/preferencedb.module';
import { ImageManagerService } from './imagemanager.service';
import { ImageProcessorService } from './imageprocessor.service';

@Module({
  imports: [ImageDBModule, PreferenceModule],
  providers: [ImageManagerService, ImageProcessorService],
  exports: [ImageManagerService],
})
export class ImageManagerModule {}
