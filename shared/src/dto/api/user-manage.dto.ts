import { z } from 'zod';
import { EUserSchema, SimpleUserSchema } from '../../entities/user.entity.js';
import { createZodDto } from '../../util/create-zod-dto.js';
import { IsPosInt } from '../../validators/positive-int.validator.js';
import { IsStringList } from '../../validators/string-list.validator.js';
import { EntityIDObjectSchema } from '../id-object.dto.js';

// UserList
export const UserListRequestSchema = z.object({
  count: IsPosInt(),
  page: IsPosInt(),
});
export class UserListRequest extends createZodDto(UserListRequestSchema) {}

export const UserListResponseSchema = z.object({
  results: z.array(EUserSchema),
  page: IsPosInt(),
  pages: IsPosInt(),
  total: IsPosInt(),
});
export class UserListResponse extends createZodDto(UserListResponseSchema) {}

// UserCreate
export const UserCreateRequestSchema = SimpleUserSchema;
export class UserCreateRequest extends createZodDto(UserCreateRequestSchema) {}

export const UserCreateResponseSchema = EUserSchema;
export class UserCreateResponse extends createZodDto(
  UserCreateResponseSchema,
) {}

// UserDelete
export const UserDeleteRequestSchema = EntityIDObjectSchema;
export class UserDeleteRequest extends createZodDto(UserDeleteRequestSchema) {}

export const UserDeleteResponseSchema = EUserSchema.partial({ id: true });
export class UserDeleteResponse extends createZodDto(
  UserDeleteResponseSchema,
) {}

// UserInfo
export const UserInfoRequestSchema = EntityIDObjectSchema;
export class UserInfoRequest extends createZodDto(UserInfoRequestSchema) {}

export const UserInfoResponseSchema = EUserSchema;
export class UserInfoResponse extends createZodDto(UserInfoResponseSchema) {}

// UserUpdate
export const UserUpdateRequestSchema = EntityIDObjectSchema.merge(
  SimpleUserSchema.partial(),
);
export class UserUpdateRequest extends createZodDto(UserUpdateRequestSchema) {}

export const UserUpdateResponseSchema = EUserSchema;
export class UserUpdateResponse extends createZodDto(
  UserUpdateResponseSchema,
) {}

// GetSpecialUsers
export const GetSpecialUsersResponseSchema = z.object({
  UndeletableUsersList: IsStringList(),
  ImmutableUsersList: IsStringList(),
  LockedLoginUsersList: IsStringList(),
});
export class GetSpecialUsersResponse extends createZodDto(
  GetSpecialUsersResponseSchema,
) {}
