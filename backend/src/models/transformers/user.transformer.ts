import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { EUserBackend } from '../entities/user.entity';

export function EUserBackend2EUser(eUser: EUserBackend): EUser {
  if (eUser.hashed_password === undefined) return eUser as EUser;

  return {
    ...eUser,
    hashedPassword: undefined,
  };
}
