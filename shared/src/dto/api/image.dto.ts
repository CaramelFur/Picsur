import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { ImageFileType } from '../image-file-types.dto';

export const ImageMetaResponseSchema = z.object({
  image: EImageSchema,
  fileMimes: z.object({
    [ImageFileType.MASTER]: z.string(),
    [ImageFileType.ORIGINAL]: z.union([z.string(), z.undefined()]),
  }),
});
export class ImageMetaResponse extends createZodDto(ImageMetaResponseSchema) {}

export const ImageUploadResponseSchema = EImageSchema;
export class ImageUploadResponse extends createZodDto(
  ImageUploadResponseSchema,
) {}
