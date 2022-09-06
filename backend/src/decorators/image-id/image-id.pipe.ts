import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Fail, FT } from 'picsur-shared/dist/types';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';

@Injectable()
export class ImageIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (UUIDRegex.test(value)) return value;
    throw Fail(FT.UsrValidation, 'Invalid image id');
  }
}
