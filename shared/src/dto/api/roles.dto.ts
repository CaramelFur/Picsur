import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ERole } from '../../entities/role.entity';
import { Permissions, PermissionsList } from '../permissions';

// RoleInfo
export class RoleInfoRequest {
  @IsNotEmpty()
  @IsString()
  name: string;
}

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
export class RoleUpdateRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}
export class RoleUpdateResponse extends ERole {}

// RoleCreate
export class RoleCreateRequest extends ERole {}
export class RoleCreateResponse extends ERole {}

// RoleDelete
export class RoleDeleteRequest {
  @IsNotEmpty()
  name: string;
}
export class RoleDeleteResponse extends ERole {}
