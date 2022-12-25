import { string, z } from 'zod';
import { SemVerRegex } from '../../util/common-regex';
import { createZodDto } from '../../util/create-zod-dto';
import { IsEntityID } from '../../validators/entity-id.validator';
import { IsStringList } from '../../validators/string-list.validator';
import { TrackingStateSchema } from '../tracking-state.enum';

export const InfoResponseSchema = z.object({
  production: z.boolean(),
  demo: z.boolean(),
  version: string().regex(SemVerRegex),
  tracking: z.object({
    state: TrackingStateSchema,
    id: IsEntityID().optional(),
  }),
});
export class InfoResponse extends createZodDto(InfoResponseSchema) {}

// Allpermissions
export const AllPermissionsResponseSchema = z.object({
  permissions: IsStringList(),
});
export class AllPermissionsResponse extends createZodDto(
  AllPermissionsResponseSchema,
) {}

export const AllFormatsResponseSchema = z.object({
  image: z.record(string(), z.string()),
  anim: z.record(string(), z.string()),
});
export class AllFormatsResponse extends createZodDto(
  AllFormatsResponseSchema,
) {}
