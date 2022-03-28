import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CombinePDecorators } from 'picsur-shared/dist/util/decorator';
import { MultiPartFieldDto, MultiPartFileDto } from './multipart.dto';

export const IsMultiPartFile = CombinePDecorators(
  IsDefined(),
  ValidateNested(),
  Type(() => MultiPartFileDto),
);

export const IsMultiPartField = CombinePDecorators(
  IsDefined(),
  ValidateNested(),
  Type(() => MultiPartFieldDto),
);
