import { Type } from 'class-transformer';
import {
  IsArray, IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty, IsPositive,
  IsString,
  ValidateNested
} from 'class-validator';
import { EUser } from '../../entities/user.entity';
import { Permissions, PermissionsList } from '../permissions';
import { Roles } from '../roles.dto';

// Api

// UserLogin
export class UserLoginRequest {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserLoginResponse {
  @IsString()
  @IsDefined()
  jwt_token: string;
}

// UserRegister
export class UserRegisterRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserRegisterResponse extends EUser {}

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

// UserMe
export class UserMeResponse {
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  user: EUser;

  @IsString()
  @IsDefined()
  token: string;
}

// UserMePermissions
export class UserMePermissionsResponse {
  @IsDefined()
  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
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