import { Module } from '@nestjs/common';
import { ImageDBModule } from 'src/collections/imagedb/imagedb.module';
import { ImageManagerService } from './imagemanager.service';

@Module({
  imports: [ImageDBModule],
  providers: [ImageManagerService],
  exports: [ImageManagerService],
})
export class ImageManagerModule {}
