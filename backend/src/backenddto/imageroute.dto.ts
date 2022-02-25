import { IsDefined, ValidateNested } from 'class-validator';
import { MultiPartFileDto } from './multipart.dto';

export class ImageUploadDto {
  @IsDefined()
  @ValidateNested()
  image: MultiPartFileDto;
}
