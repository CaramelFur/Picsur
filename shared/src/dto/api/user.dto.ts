import { z } from 'zod';
import { EUserSchema } from '../../entities/user.entity.js';
import { createZodDto } from '../../util/create-zod-dto.js';
import { IsStringList } from '../../validators/string-list.validator.js';
import { IsPlainTextPwd, IsUsername } from '../../validators/user.validators.js';

// Api
const UserPassSchema = z.object({
  username: IsUsername(),
  password: IsPlainTextPwd(),
});

// UserLogin
export const UserLoginRequestSchema = UserPassSchema;
export class UserLoginRequest extends createZodDto(UserLoginRequestSchema) {}

export const UserLoginResponseSchema = z.object({
  jwt_token: z.string(),
});
export class UserLoginResponse extends createZodDto(UserLoginResponseSchema) {}

// UserRegister
export const UserRegisterRequestSchema = UserPassSchema;
export class UserRegisterRequest extends createZodDto(
  UserRegisterRequestSchema,
) {}

export const UserRegisterResponseSchema = EUserSchema;
export class UserRegisterResponse extends createZodDto(
  UserRegisterResponseSchema,
) {}

// UserCheckName
export const UserCheckNameRequestSchema = z.object({
  username: IsUsername(),
});
export class UserCheckNameRequest extends createZodDto(
  UserCheckNameRequestSchema,
) {}

export const UserCheckNameResponseSchema = z.object({
  available: z.boolean(),
});
export class UserCheckNameResponse extends createZodDto(
  UserCheckNameResponseSchema,
) {}

// UserMe
export const UserMeResponseSchema = z.object({
  user: EUserSchema,
  token: z.string(),
});
export class UserMeResponse extends createZodDto(UserMeResponseSchema) {}

// UserMePermissions
export const UserMePermissionsResponseSchema = z.object({
  permissions: IsStringList(),
});
export class UserMePermissionsResponse extends createZodDto(
  UserMePermissionsResponseSchema,
) {}
