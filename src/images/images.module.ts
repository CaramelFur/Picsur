import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImagesService } from './images.service';
import { MimesService } from './mimes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [ImagesService, MimesService],
  exports: [ImagesService, MimesService],
})
export class ImagesModule {}
