import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImageDBService } from './imagedb.service';
import { MimesService } from './mimes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImageDBService, MimesService],
  exports: [ImageDBService, MimesService],
})
export class ImageDBModule {}
