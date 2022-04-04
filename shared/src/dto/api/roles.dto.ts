import { z } from 'zod';
import {
  ERoleSchema, SimpleRoleSchema
} from '../../entities/role.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsRoleName } from '../../validators/role.validators';
import { IsStringList } from '../../validators/string-list.validator';

// RoleInfo
export const RoleInfoRequestSchema = z.object({
  name: IsRoleName(),
});
export class RoleInfoRequest extends createZodDto(RoleInfoRequestSchema) {}

export const RoleInfoResponseSchema = ERoleSchema;
export class RoleInfoResponse extends createZodDto(RoleInfoResponseSchema) {}

// RoleList
export const RoleListResponseSchema = z.object({
  roles: z.array(ERoleSchema),
  total: IsPosInt(),
});
export class RoleListResponse extends createZodDto(RoleListResponseSchema) {}

// RoleUpdate
export const RoleUpdateRequestSchema = SimpleRoleSchema.partial({
  permissions: true,
});
export class RoleUpdateRequest extends createZodDto(RoleUpdateRequestSchema) {}

export const RoleUpdateResponseSchema = ERoleSchema;
export class RoleUpdateResponse extends createZodDto(RoleUpdateResponseSchema) {}

// RoleCreate
export const RoleCreateRequestSchema = SimpleRoleSchema;
export class RoleCreateRequest extends createZodDto(RoleCreateRequestSchema) {}

export const RoleCreateResponseSchema = ERoleSchema;
export class RoleCreateResponse extends createZodDto(RoleCreateResponseSchema) {}

// RoleDelete
export const RoleDeleteRequestSchema = z.object({
  name: IsRoleName(),
});
export class RoleDeleteRequest extends createZodDto(RoleDeleteRequestSchema) {}

export const RoleDeleteResponseSchema = ERoleSchema;
export class RoleDeleteResponse extends createZodDto(RoleDeleteResponseSchema) {}

// SpecialRoles

export const SpecialRolesResponseSchema = z.object({
  SoulBoundRoles: IsStringList(),
  ImmutableRoles: IsStringList(),
  UndeletableRoles: IsStringList(),
  DefaultRoles: IsStringList(),
});
export class SpecialRolesResponse extends createZodDto(SpecialRolesResponseSchema) {}
