import { Roles } from 'picsur-shared/dist/dto/roles.dto';

export interface FullUserModel {
  username: string;
  password: string;
  roles: Roles;
}
