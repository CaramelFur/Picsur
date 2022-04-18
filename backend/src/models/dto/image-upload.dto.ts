import { createZodDto } from 'picsur-shared/dist/util/create-zod-dto';
import { z } from 'zod';
import { MultiPartFileDtoSchema } from './multipart.dto';

// A validation class for form based file upload of an image
export const ImageUploadDtoSchema = z.object({
  image: MultiPartFileDtoSchema,
});
export class ImageUploadDto extends createZodDto(ImageUploadDtoSchema) {}
