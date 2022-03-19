import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { EUser } from '../../entities/user.entity';
import { Roles } from '../roles.dto';

// UserList
export class UserListRequest {
  @IsDefined()
  @IsInt()
  @Min(0)
  count: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  page: number;
}

export class UserListResponse {
  @IsArray()
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  users: EUser[];

  @IsDefined()
  @IsInt()
  @Min(0)
  count: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  page: number;
}

// UserCreate
export class UserCreateRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserCreateResponse extends EUser {}


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
