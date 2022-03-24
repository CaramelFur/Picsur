import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined, IsOptional,
  IsString, ValidateNested
} from 'class-validator';
import { EUser, NamePassUser, UsernameUser } from '../../entities/user.entity';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsPlainTextPwd } from '../../validators/user.validators';
import { Roles } from '../roles.dto';

// UserList
export class UserListRequest {
  @IsPosInt()
  count: number;

  @IsPosInt()
  page: number;
}

export class UserListResponse {
  @IsArray()
  @IsDefined()
  @ValidateNested()
  @Type(() => EUser)
  users: EUser[];

  @IsPosInt()
  count: number;

  @IsPosInt()
  page: number;
}

// UserCreate
export class UserCreateRequest extends NamePassUser {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: Roles;
}
export class UserCreateResponse extends EUser {}

// UserDelete
export class UserDeleteRequest extends UsernameUser {}
export class UserDeleteResponse extends EUser {}

// UserInfo
export class UserInfoRequest extends UsernameUser {}
export class UserInfoResponse extends EUser {}

// UserUpdateRoles
export class UserUpdateRequest extends UsernameUser {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: Roles;

  @IsPlainTextPwd()
  @IsOptional()
  password?: string;
}

export class UserUpdateResponse extends EUser {}
