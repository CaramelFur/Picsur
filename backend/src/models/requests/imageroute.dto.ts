import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { MultiPartFileDto } from './multipart.dto';

export class ImageUploadDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => MultiPartFileDto)
  image: MultiPartFileDto;
}
