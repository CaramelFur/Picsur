import { IsArray, IsEnum } from 'class-validator';
import { Permissions, PermissionsList } from '../dto/permissions';
import { EntityID } from '../validators/entity-id.validator';
import { IsRoleName } from '../validators/role.validators';

export class RoleNameObject {
  @IsRoleName()
  name: string;
}

export class RoleNamePermsObject extends RoleNameObject {
  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}

export class ERole extends RoleNamePermsObject {
  @EntityID()
  id?: number;
}
