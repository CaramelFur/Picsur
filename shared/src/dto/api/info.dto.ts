import { string, z } from 'zod';
import { SemVer } from '../../util/common-regex';
import { createZodDto } from '../../util/create-zod-dto';
import { IsStringList } from '../../validators/string-list.validator';

export const InfoResponseSchema = z.object({
  production: z.boolean(),
  demo: z.boolean(),
  version: string().regex(SemVer),
});
export class InfoResponse extends createZodDto(InfoResponseSchema) {}

// Allpermissions
export const AllPermissionsResponseSchema = z.object({
  permissions: IsStringList(),
});
export class AllPermissionsResponse extends createZodDto(AllPermissionsResponseSchema) {}
