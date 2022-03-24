import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { EUser, NamePassUser, UsernameUser } from '../../entities/user.entity';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsStringList } from '../../validators/string-list.validator';
import { IsPlainTextPwd } from '../../validators/user.validators';

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
  @IsStringList()
  roles?: string[];
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
  @IsStringList()
  roles?: string[];

  @IsPlainTextPwd()
  @IsOptional()
  password?: string;
}

export class UserUpdateResponse extends EUser {}

// GetSpecialUsers
export class GetSpecialUsersResponse {
  @IsDefined()
  @IsStringList()
  UndeletableUsersList: string[];

  @IsDefined()
  @IsStringList()
  ImmutableUsersList: string[];
  
  @IsDefined()
  @IsStringList()
  LockedLoginUsersList: string[];
}
