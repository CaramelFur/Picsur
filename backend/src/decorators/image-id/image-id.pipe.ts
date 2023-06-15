import { Injectable, PipeTransform } from '@nestjs/common';
import { FT, Fail } from 'picsur-shared/dist/types/failable';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';

@Injectable()
export class ImageIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (UUIDRegex.test(value)) return value;
    throw Fail(FT.UsrValidation, 'Invalid image id');
  }
}
