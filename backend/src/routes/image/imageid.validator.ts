import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { isHash } from 'class-validator';

@Injectable()
export class ImageIdValidator implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isHash(value, 'sha256')) {
      return value;
    }
    throw new BadRequestException('Invalid image id');
  }
}
