import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EImageBackend } from '../../models/entities/image.entity';
import { ImageDBService } from './imagedb.service';
import { MimesService } from './mimes.service';

@Module({
  imports: [TypeOrmModule.forFeature([EImageBackend])],
  providers: [ImageDBService, MimesService],
  exports: [ImageDBService, MimesService],
})
export class ImageDBModule {}
