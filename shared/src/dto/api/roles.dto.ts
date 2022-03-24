import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined, ValidateNested
} from 'class-validator';
import {
  ERole,
  RoleNameObject,
  RoleNamePermsObject
} from '../../entities/role.entity';
import { IsPosInt } from '../../validators/positive-int.validator';

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

  @IsPosInt()
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
