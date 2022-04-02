import { IsArray } from 'class-validator';
import { ERole, SimpleRole } from '../../entities/role.entity';
import { IsNested } from '../../validators/nested.validator';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsRoleName } from '../../validators/role.validators';
import { IsStringList } from '../../validators/string-list.validator';

// RoleInfo
export class RoleInfoRequest {
  @IsRoleName()
  name: string;
}
export class RoleInfoResponse extends ERole {}

// RoleList
export class RoleListResponse {
  @IsArray()
  @IsNested(ERole)
  roles: ERole[];

  @IsPosInt()
  total: number;
}

// RoleUpdate
export class RoleUpdateRequest extends SimpleRole {}
export class RoleUpdateResponse extends ERole {}

// RoleCreate
export class RoleCreateRequest extends SimpleRole {}
export class RoleCreateResponse extends ERole {}

// RoleDelete
export class RoleDeleteRequest {
  @IsRoleName()
  name: string;
}
export class RoleDeleteResponse extends ERole {}

// SpecialRoles
export class SpecialRolesResponse {
  @IsStringList()
  SoulBoundRoles: string[];

  @IsStringList()
  ImmutableRoles: string[];

  @IsStringList()
  UndeletableRoles: string[];

  @IsStringList()
  DefaultRoles: string[];
}
