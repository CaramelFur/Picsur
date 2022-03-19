import { Type } from 'class-transformer';
import {
  IsArray, IsDefined,
  IsEnum, IsNotEmpty, IsString,
  ValidateNested
} from 'class-validator';
import { EUser } from '../../entities/user.entity';
import { Permissions, PermissionsList } from '../permissions';

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
