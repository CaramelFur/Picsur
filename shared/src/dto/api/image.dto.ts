import { EImageSchema } from '../../entities/image.entity';
import { createZodDto } from '../../util/create-zod-dto';

export const ImageMetaResponseSchema = EImageSchema;
export class ImageMetaResponse extends createZodDto(ImageMetaResponseSchema) {}
