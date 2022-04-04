import { z } from 'zod';
import { EUserSchema } from '../../entities/user.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { IsStringList } from '../../validators/string-list.validator';
import { IsPlainTextPwd, IsUsername } from '../../validators/user.validators';

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
export class UserRegisterRequest extends createZodDto(UserRegisterRequestSchema) {}

export const UserRegisterResponseSchema = EUserSchema;
export class UserRegisterResponse extends createZodDto(UserRegisterResponseSchema) {}

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
export class UserMePermissionsResponse extends createZodDto(UserMePermissionsResponseSchema) {}
