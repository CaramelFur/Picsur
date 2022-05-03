import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { IsPosInt } from '../../validators/positive-int.validator';

export const ImageUploadResponseSchema = EImageSchema;
export class ImageUploadResponse extends createZodDto(
  ImageUploadResponseSchema,
) {}

export const ImageListResponseSchema = z.object({
  images: z.array(EImageSchema),
  count: IsPosInt(),
  page: IsPosInt(),
});
export class ImageListResponse extends createZodDto(ImageListResponseSchema) {}
