import { SetMetadata, UseGuards } from '@nestjs/common';
import { CombineFCDecorators } from 'picsur-shared/dist/util/decorator';
import { LocalAuthGuard } from '../managers/auth/guards/localauth.guard';
import { Permissions } from '../models/dto/permissions.dto';

export const RequiredPermissions = (...permissions: Permissions) => {
  return SetMetadata('permissions', permissions);
};

// Easy to read roles
export const NoPermissions = () => RequiredPermissions();

export const UseLocalAuth = (...permissions: Permissions) =>
  CombineFCDecorators(
    RequiredPermissions(...permissions),
    UseGuards(LocalAuthGuard),
  );
