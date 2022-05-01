import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { ImageFileType } from '../image-file-types.dto';

const parseBool = (value: unknown): boolean | null => {
  if (value === 'true' || value === '1' || value === 'yes') return true;
  if (value === 'false' || value === '0' || value === 'no') return false;
  return null;
};

export const ImageRequestParamsSchema = z
  .object({
    height: z.preprocess(Number, z.number().int().min(1).max(32767)),
    width: z.preprocess(Number, z.number().int().min(1).max(32767)),
    rotate: z.preprocess(
      Number,
      z.number().int().multipleOf(90).min(0).max(360),
    ),
    flipx: z.preprocess(parseBool, z.boolean()),
    flipy: z.preprocess(parseBool, z.boolean()),
    greyscale: z.preprocess(parseBool, z.boolean()),
    noalpha: z.preprocess(parseBool, z.boolean()),
    negative: z.preprocess(parseBool, z.boolean()),
    quality: z.preprocess(Number, z.number().int().min(1).max(100)),
  })
  .partial();

export class ImageRequestParams extends createZodDto(
  ImageRequestParamsSchema,
) {}

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
