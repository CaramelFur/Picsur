import { IsArray, IsOptional } from 'class-validator';
import { EUser, SimpleUser } from '../../entities/user.entity';
import { Newable } from '../../types';
import { IsEntityID } from '../../validators/entity-id.validator';
import { IsNested } from '../../validators/nested.validator';
import { IsPosInt } from '../../validators/positive-int.validator';
import { IsStringList } from '../../validators/string-list.validator';
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
  @IsNested(EUser)
  users: EUser[];

  @IsPosInt()
  count: number;

  @IsPosInt()
  page: number;
}

// UserCreate
export class UserCreateRequest extends SimpleUser {}
export class UserCreateResponse extends EUser {}

// UserDelete
export class UserDeleteRequest extends EntityIDObject {}
export class UserDeleteResponse extends EUser {}

// UserInfo
export class UserInfoRequest extends EntityIDObject {}
export class UserInfoResponse extends EUser {}

// UserUpdate
export class UserUpdateRequest extends (SimpleUser as Newable<
  Partial<SimpleUser>
>) {
  @IsEntityID()
  id: string;

  @IsOptional()
  override username?: string;

  @IsOptional()
  override password?: string;

  @IsOptional()
  override roles?: string[];
}
export class UserUpdateResponse extends EUser {}

// GetSpecialUsers
export class GetSpecialUsersResponse {
  @IsStringList()
  UndeletableUsersList: string[];

  @IsStringList()
  ImmutableUsersList: string[];

  @IsStringList()
  LockedLoginUsersList: string[];
}
