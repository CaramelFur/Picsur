import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { IsPosInt } from '../../validators/positive-int.validator';

// Image upload
export const ImageUploadResponseSchema = EImageSchema;
export class ImageUploadResponse extends createZodDto(
  ImageUploadResponseSchema,
) {}

// Image list

export const ImageListRequestSchema = z.object({
  count: IsPosInt(),
  page: IsPosInt(),
  user_id: z.string().uuid().optional(),
});
export class ImageListRequest extends createZodDto(ImageListRequestSchema) {}

export const ImageListResponseSchema = z.object({
  images: z.array(EImageSchema),
  page: IsPosInt(),
  pages: IsPosInt(),
});
export class ImageListResponse extends createZodDto(ImageListResponseSchema) {}

// Image Delete

export const ImageDeleteRequestSchema = z.object({
  ids: z.array(z.string().uuid()),
});
export class ImageDeleteRequest extends createZodDto(
  ImageDeleteRequestSchema,
) {}

export const ImageDeleteResponseSchema = z.object({
  images: z.array(EImageSchema),
});
export class ImageDeleteResponse extends createZodDto(
  ImageDeleteResponseSchema,
) {}
