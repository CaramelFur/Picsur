import { Module } from '@nestjs/common';
import { PicsurApiModule } from './api/api.module';
import { ImageModule } from './image/imageroute.module';

@Module({
  imports: [PicsurApiModule, ImageModule],
})
export class PicsurRoutesModule {}
