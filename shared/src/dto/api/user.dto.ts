import { Type } from 'class-transformer';
import {
  IsArray, IsDefined,
  IsEnum, IsString,
  ValidateNested
} from 'class-validator';
import { EUser, SimpleUser } from '../../entities/user.entity';
import { Permissions, PermissionsList } from '../permissions';

// Api

// UserLogin
export class UserLoginRequest extends SimpleUser {}

export class UserLoginResponse {
  @IsString()
  @IsDefined()
  jwt_token: string;
}

// UserRegister
export class UserRegisterRequest extends SimpleUser {}

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
