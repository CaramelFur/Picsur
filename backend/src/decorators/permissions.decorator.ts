import { SetMetadata, UseGuards } from '@nestjs/common';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { CombineDecorators } from 'picsur-shared/dist/util/decorator';
import { LocalAuthGuard } from '../managers/auth/guards/localauth.guard';

export const RequiredPermissions = (...permissions: Permissions) => {
  return SetMetadata('permissions', permissions);
};

// Easy to read roles
export const NoAuth = () => RequiredPermissions();

export const UseLocalAuth = (...permissions: Permissions) =>
  CombineDecorators(
    RequiredPermissions(...permissions),
    UseGuards(LocalAuthGuard),
  );
