import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator.js';
import { IsRoleName } from '../validators/role.validators.js';
import { IsStringList } from '../validators/string-list.validator.js';

export const SimpleRoleSchema = z.object({
  name: IsRoleName(),
  permissions: IsStringList(),
});
export type SimpleRole = z.infer<typeof SimpleRoleSchema>;

export const ERoleSchema = z.object({
  id: IsEntityID().optional(),
  name: IsRoleName(),
  permissions: IsStringList(),
});
export type ERole = z.infer<typeof ERoleSchema>;
