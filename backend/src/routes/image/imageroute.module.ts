import { Module } from '@nestjs/common';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/imagemanager/imagemanager.module';
import { ImageController } from './imageroute.controller';

@Module({
  imports: [ImageManagerModule, DecoratorsModule],
  controllers: [ImageController],
})
export class ImageModule {}
