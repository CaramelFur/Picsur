import { z } from 'zod';
import { EImageSchema } from '../../entities/image.entity';
import { EUserSchema } from '../../entities/user.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { ParseBool, ParseInt } from '../../util/parse-simple';
import { ImageEntryVariant } from '../image-entry-variant.enum';

export const ImageRequestParamsSchema = z
  .object({
    height: z.preprocess(ParseInt, z.number().int().min(1).max(32767)),
    width: z.preprocess(ParseInt, z.number().int().min(1).max(32767)),
    rotate: z.preprocess(
      ParseInt,
      z.number().int().multipleOf(90).min(0).max(360),
    ),
    flipx: z.preprocess(ParseBool, z.boolean()),
    flipy: z.preprocess(ParseBool, z.boolean()),
    greyscale: z.preprocess(ParseBool, z.boolean()),
    noalpha: z.preprocess(ParseBool, z.boolean()),
    negative: z.preprocess(ParseBool, z.boolean()),
    shrinkonly: z.preprocess(ParseBool, z.boolean()),
    quality: z.preprocess(ParseInt, z.number().int().min(1).max(100)),
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
