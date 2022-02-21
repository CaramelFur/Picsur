import { Module } from '@nestjs/common';
import { SafeImagesModule } from 'src/lib/safeimages/safeimages.module';
import { ImageController } from './imageroute.controller';

@Module({
  imports: [SafeImagesModule],
  controllers: [ImageController],
})
export class ImageModule {}
