import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { SHA256Regex } from 'picsur-shared/dist/util/common-regex';

@Injectable()
export class ImageIdValidator implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // Check regex for sha256
    if (SHA256Regex.test(value)) return value;
    throw new BadRequestException('Invalid image id');
  }
}
