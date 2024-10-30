import { Param, PipeTransform, Type } from '@nestjs/common';
import { ImageFullIdPipe } from './image-full-id.pipe.js';

export const ImageFullIdParam = (
  ...pipes: (PipeTransform<any, any> | Type<PipeTransform<any, any>>)[]
) => Param('id', ImageFullIdPipe, ...pipes);
