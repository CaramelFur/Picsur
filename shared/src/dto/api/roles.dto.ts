import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ERole } from '../../entities/role.entity';
import { Permissions, PermissionsList } from '../permissions';

export class RoleInfoRequest {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class RoleUpdateRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}

export class RoleCreateRequest extends ERole {}

export class RoleDeleteRequest {
  @IsNotEmpty()
  name: string;
}
