import { Param, PipeTransform, Type } from '@nestjs/common';
import { ImageFullIdPipe } from './image-full-id.pipe';

export const ImageFullIdParam = (
  ...pipes: (PipeTransform<any, any> | Type<PipeTransform<any, any>>)[]
) => Param('id', ImageFullIdPipe, ...pipes);
