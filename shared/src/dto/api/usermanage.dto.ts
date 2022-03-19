import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsInt, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { EUser } from '../../entities/user.entity';
import { Roles } from '../roles.dto';

// UserDelete
export class UserDeleteRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class UserDeleteResponse extends EUser {}

// UserInfo
export class UserInfoRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class UserInfoResponse extends EUser {}

// UserList
export class UserListResponse {
  @IsArray()
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  users: EUser[];

  @IsInt()
  @IsPositive()
  @IsDefined()
  total: number;
}

// UserUpdateRoles
export class UserUpdateRolesRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsArray()
  @IsDefined()
  @IsString({ each: true })
  roles: Roles;
}

export class UserUpdateRolesResponse extends EUser {}
