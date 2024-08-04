import { string, z } from 'zod';
import { SemVerRegex } from '../../util/common-regex.js';
import { createZodDto } from '../../util/create-zod-dto.js';
import { IsEntityID } from '../../validators/entity-id.validator.js';
import { IsStringList } from '../../validators/string-list.validator.js';
import { TrackingStateSchema } from '../tracking-state.enum.js';

export const InfoResponseSchema = z.object({
  production: z.boolean(),
  demo: z.boolean(),
  version: string().regex(SemVerRegex),
  host_override: z.string().optional(),
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
