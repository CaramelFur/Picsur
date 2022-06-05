import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';

@Injectable()
export class ImageIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (UUIDRegex.test(value)) return value;
    throw new BadRequestException('Invalid image id');
  }
}
