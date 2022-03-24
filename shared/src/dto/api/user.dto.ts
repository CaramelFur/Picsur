import { Type } from 'class-transformer';
import {
  IsArray, IsDefined,
  IsEnum, IsJWT, IsString,
  ValidateNested
} from 'class-validator';
import { EUser, NamePassUser } from '../../entities/user.entity';
import { Permissions, PermissionsList } from '../permissions';

// Api

// UserLogin
export class UserLoginRequest extends NamePassUser {}

export class UserLoginResponse {
  @IsString()
  @IsDefined()
  @IsJWT()
  jwt_token: string;
}

// UserRegister
export class UserRegisterRequest extends NamePassUser {}

export class UserRegisterResponse extends EUser {}

// UserMe
export class UserMeResponse {
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  user: EUser;

  @IsString()
  @IsDefined()
  @IsJWT()
  token: string;
}

// UserMePermissions
export class UserMePermissionsResponse {
  @IsDefined()
  @IsArray()
  @IsEnum(PermissionsList, { each: true })
  permissions: Permissions;
}
