import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { EUser, NamePassUser } from '../../entities/user.entity';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsStringList } from '../../validators/string-list.validator';
import { IsPlainTextPwd, IsUsername } from '../../validators/user.validators';
import { EntityIDObject } from '../idobject.dto';

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
export class UserDeleteRequest extends EntityIDObject {}
export class UserDeleteResponse extends EUser {}

// UserInfo
export class UserInfoRequest extends EntityIDObject {}
export class UserInfoResponse extends EUser {}

// UserUpdate
export class UserUpdateRequest extends EntityIDObject {
  @IsOptional()
  @IsUsername()
  username?: string;

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
