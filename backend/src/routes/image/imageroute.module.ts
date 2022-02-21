import { Module } from '@nestjs/common';
import { ImageManagerModule } from 'src/managers/imagemanager/imagemanager.module';

import { ImageController } from './imageroute.controller';

@Module({
  imports: [ImageManagerModule],
  controllers: [ImageController],
})
export class ImageModule {}
