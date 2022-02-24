import { IsDefined, ValidateNested } from 'class-validator';
import { MultiPartDto } from '../../decorators/multipart.decorator';
import { MultiPartFileDto } from '../../decorators/multipart.dto';

export class ImageUploadDto extends MultiPartDto {
  @IsDefined()
  @ValidateNested()
  image: MultiPartFileDto;
}
