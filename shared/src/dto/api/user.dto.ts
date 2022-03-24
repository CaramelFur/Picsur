import { Type } from 'class-transformer';
import {
  IsDefined, IsJWT,
  IsString,
  ValidateNested
} from 'class-validator';
import { EUser, NamePassUser } from '../../entities/user.entity';
import { IsStringList } from '../../validators/string-list.validator';

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
  @IsStringList()
  permissions: string[];
}
