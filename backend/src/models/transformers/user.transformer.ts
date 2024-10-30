import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { EUserBackend } from '../../database/entities/users/user.entity.js';

export function EUserBackend2EUser(eUser: EUserBackend): EUser {
  if (eUser.hashed_password === undefined) return eUser as EUser;

  return {
    ...eUser,
    hashedPassword: undefined,
  };
}
