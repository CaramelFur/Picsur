import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity.js';
import { EUserSchema } from '../../entities/user.entity.js';
import { createZodDto } from '../../util/create-zod-dto.js';
import { ParseBoolZ, ParseIntZ } from '../../util/parse-simple.js';
import { ImageEntryVariant } from '../image-entry-variant.enum.js';

export const ImageRequestParamsSchema = z
  .object({
    height: z.preprocess(ParseIntZ, z.number().int().min(1).max(32767)),
    width: z.preprocess(ParseIntZ, z.number().int().min(1).max(32767)),
    rotate: z.preprocess(
      ParseIntZ,
      z.number().int().multipleOf(90).min(0).max(360),
    ),
    flipx: z.preprocess(ParseBoolZ, z.boolean()),
    flipy: z.preprocess(ParseBoolZ, z.boolean()),
    greyscale: z.preprocess(ParseBoolZ, z.boolean()),
    noalpha: z.preprocess(ParseBoolZ, z.boolean()),
    negative: z.preprocess(ParseBoolZ, z.boolean()),
    shrinkonly: z.preprocess(ParseBoolZ, z.boolean()),
    quality: z.preprocess(ParseIntZ, z.number().int().min(1).max(100)),
  })
  .partial();

export class ImageRequestParams extends createZodDto(
  ImageRequestParamsSchema,
) {}

export const ImageMetaResponseSchema = z.object({
  image: EImageSchema,
  user: EUserSchema,
  fileTypes: z.object({
    [ImageEntryVariant.MASTER]: z.string(),
    [ImageEntryVariant.ORIGINAL]: z.union([z.string(), z.undefined()]),
  }),
});
export class ImageMetaResponse extends createZodDto(ImageMetaResponseSchema) {}
