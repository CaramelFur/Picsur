import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageDBService } from './imagedb.service';
import { MimesService } from './mimes.service';
import { EImage } from 'picsur-shared/dist/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EImage])],
  providers: [ImageDBService, MimesService],
  exports: [ImageDBService, MimesService],
})
export class ImageDBModule {}
