import { MultiPartFileDto } from './multipart.dto';
import { IsMultiPartFile } from './multipart.validator';

// A validation class for form based file upload of an image
export class ImageUploadDto {
  @IsMultiPartFile()
  image: MultiPartFileDto;
}
