import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity.js';
import { createZodDto } from '../../util/create-zod-dto.js';
import { IsApiKey } from '../../validators/api-key.validator.js';
import { IsEntityID } from '../../validators/entity-id.validator.js';
import { IsPosInt } from '../../validators/positive-int.validator.js';

// Image upload
export const ImageUploadResponseSchema = EImageSchema.extend({
  delete_key: IsApiKey().optional(),
});
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
  results: z.array(EImageSchema),
  total: IsPosInt(),
  page: IsPosInt(),
  pages: IsPosInt(),
});
export class ImageListResponse extends createZodDto(ImageListResponseSchema) {}

// Image update
export const ImageUpdateRequestSchema = EImageSchema.pick({
  id: true,
  expires_at: true,
  file_name: true,
}).partial({
  expires_at: true,
  file_name: true,
});
export class ImageUpdateRequest extends createZodDto(
  ImageUpdateRequestSchema,
) {}

export const ImageUpdateResponseSchema = EImageSchema;
export class ImageUpdateResponse extends createZodDto(
  ImageUpdateResponseSchema,
) {}

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

// Image Delete with Key
export const ImageDeleteWithKeyRequestSchema = z.object({
  id: IsEntityID(),
  key: IsApiKey(),
});
export class ImageDeleteWithKeyRequest extends createZodDto(
  ImageDeleteWithKeyRequestSchema,
) {}

export const ImageDeleteWithKeyResponseSchema = EImageSchema;
export class ImageDeleteWithKeyResponse extends createZodDto(
  ImageDeleteWithKeyResponseSchema,
) {}

// Image List All
export const ImageListAllRequestSchema = z.object({
  user_id: z.string().uuid().optional(),
});
export class ImageListAllRequest extends createZodDto(ImageListAllRequestSchema) {}

export const ImageListAllResponseSchema = z.object({
  results: z.array(EImageSchema),
  total: IsPosInt(),
});
export class ImageListAllResponse extends createZodDto(ImageListAllResponseSchema) {}
