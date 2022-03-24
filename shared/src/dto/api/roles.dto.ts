import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt, IsPositive,
  ValidateNested
} from 'class-validator';
import {
  ERole,
  RoleNameObject,
  RoleNamePermsObject
} from '../../entities/role.entity';

// RoleInfo
export class RoleInfoRequest extends RoleNameObject {}
export class RoleInfoResponse extends ERole {}

// RoleList
export class RoleListResponse {
  @IsArray()
  @IsDefined()
  @ValidateNested()
  @Type(() => ERole)
  roles: ERole[];

  @IsInt()
  @IsPositive()
  @IsDefined()
  total: number;
}

// RoleUpdate
export class RoleUpdateRequest extends RoleNamePermsObject {}
export class RoleUpdateResponse extends ERole {}

// RoleCreate
export class RoleCreateRequest extends ERole {}
export class RoleCreateResponse extends ERole {}

// RoleDelete
export class RoleDeleteRequest extends RoleNameObject {}
export class RoleDeleteResponse extends ERole {}
