import { SetMetadata, UseGuards } from '@nestjs/common';
import { Roles as RolesList } from 'picsur-shared/dist/dto/roles.dto';
import { CombineDecorators } from 'picsur-shared/dist/util/decorator';
import { LocalAuthGuard } from '../managers/auth/guards/localauth.guard';

export const GuestRoles = (...roles: RolesList) => {
  return SetMetadata('roles', roles);
};

export const UserRoles = (...roles: RolesList) => {
  const fullRoles = [...new Set(['user', ...roles])];
  return SetMetadata('roles', fullRoles);
};

// Easy to read roles
export const Guest = () => GuestRoles();
export const User = () => UserRoles();
export const Admin = () => UserRoles('admin');

export const UseLocalAuth = () =>
  CombineDecorators(Guest(), UseGuards(LocalAuthGuard));
