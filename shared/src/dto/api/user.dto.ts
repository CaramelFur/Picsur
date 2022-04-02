import {
  IsJWT
} from 'class-validator';
import { EUser } from '../../entities/user.entity';
import { IsNested } from '../../validators/nested.validator';
import { IsStringList } from '../../validators/string-list.validator';
import { IsPlainTextPwd, IsUsername } from '../../validators/user.validators';

// Api

// UserLogin
export class UserLoginRequest {
  @IsUsername()
  username: string;

  @IsPlainTextPwd()
  password: string;
}
export class UserLoginResponse {
  @IsJWT()
  jwt_token: string;
}

// UserRegister
export class UserRegisterRequest {
  @IsUsername()
  username: string;

  @IsPlainTextPwd()
  password: string;
}
export class UserRegisterResponse extends EUser {}

// UserMe
export class UserMeResponse {
  @IsNested(EUser)
  user: EUser;

  @IsJWT()
  token: string;
}

// UserMePermissions
export class UserMePermissionsResponse {
  @IsStringList()
  permissions: string[];
}
