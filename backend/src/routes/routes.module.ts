import { Module } from '@nestjs/common';
import { PicsurApiModule } from './api/api.module.js';
import { ImageModule } from './image/image.module.js';

@Module({
  imports: [PicsurApiModule, ImageModule],
})
export class PicsurRoutesModule {}
