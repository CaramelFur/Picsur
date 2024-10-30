import { Param, PipeTransform, Type } from '@nestjs/common';
import { ImageIdPipe } from './image-id.pipe.js';

export const ImageIdParam = (
  ...pipes: (PipeTransform<any, any> | Type<PipeTransform<any, any>>)[]
) => Param('id', ImageIdPipe, ...pipes);
