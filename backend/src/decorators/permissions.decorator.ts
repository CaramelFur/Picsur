import { SetMetadata, UseGuards } from '@nestjs/common';
import { CombineFCDecorators } from 'picsur-shared/dist/util/decorator';
import { LocalAuthGuard } from '../managers/auth/guards/local-auth.guard';
import { Permissions } from '../models/constants/permissions.const';

export const RequiredPermissions = (...permissions: Permissions) => {
  return SetMetadata('permissions', permissions);
};

// Just a verbose wrapper
export const NoPermissions = () => RequiredPermissions();

// This still requires permissions, but also allows the client to use user/pass authentication instead of JWT
export const UseLocalAuth = (...permissions: Permissions) =>
  CombineFCDecorators(
    RequiredPermissions(...permissions),
    UseGuards(LocalAuthGuard),
  );
