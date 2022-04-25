import { Module } from '@nestjs/common';
import { DecoratorsModule } from '../../decorators/decorators.module';
import { ImageManagerModule } from '../../managers/image/image.module';
import { ImageController } from './image.controller';

@Module({
  imports: [ImageManagerModule, DecoratorsModule],
  controllers: [ImageController],
})
export class ImageModule {}
