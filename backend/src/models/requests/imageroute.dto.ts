import { IsMultiPartFile } from '../validators/multipart.validator';
import { MultiPartFileDto } from './multipart.dto';

// A validation class for form based file upload of an image
export class ImageUploadDto {
  @IsMultiPartFile()
  image: MultiPartFileDto
}
