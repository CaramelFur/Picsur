import { IsDefined, ValidateNested } from 'class-validator';
import { MultiPartFileDto } from './multipart.dto';
import { Type } from 'class-transformer';

export class ImageUploadDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => MultiPartFileDto)
  image: MultiPartFileDto;
}
