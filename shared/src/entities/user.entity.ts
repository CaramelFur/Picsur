import { z } from 'zod';
import { IsEntityID } from '../validators/entity-id.validator';
import { IsStringList } from '../validators/string-list.validator';
import { IsPlainTextPwd, IsUsername } from '../validators/user.validators';

export const SimpleUserSchema = z.object({
  username: IsUsername(),
  password: IsPlainTextPwd(),
  roles: IsStringList(),
});
export type SimpleUser = z.infer<typeof SimpleUserSchema>;

export const EUserSchema = z.object({
  id: IsEntityID(),
  username: IsUsername(),
  roles: IsStringList(),
  hashedPassword: z.undefined(),
});
export type EUser = z.infer<typeof EUserSchema>;
