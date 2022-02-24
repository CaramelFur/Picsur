import { IsDefined, ValidateNested } from 'class-validator';
import { MultiPartDto } from 'src/decorators/multipart.decorator';
import { MultiPartFileDto } from 'src/decorators/multipart.dto';

export class ImageUploadDto extends MultiPartDto {
  @IsDefined()
  @ValidateNested()
  image: MultiPartFileDto;
}
