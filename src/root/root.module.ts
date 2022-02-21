import { Module } from '@nestjs/common';
import { ImagesModule } from 'src/images/images.module';
import { SafeImagesModule } from 'src/safeimages/safeimages.module';
import { RootController } from './root.controller';

@Module({
  imports: [SafeImagesModule],
  controllers: [RootController],
})
export class RootModule {}
