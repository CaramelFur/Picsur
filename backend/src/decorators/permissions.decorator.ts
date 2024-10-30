import {
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { Fail, FT } from 'picsur-shared/dist/types/failable';
import { CombineFCDecorators } from 'picsur-shared/dist/util/decorator';
import { LocalAuthGuard } from '../managers/auth/guards/local-auth.guard.js';
import { Permission, Permissions } from '../models/constants/permissions.const.js';
import AuthFastifyRequest from '../models/interfaces/authrequest.dto.js';

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

export const HasPermission = createParamDecorator(
  (data: Permission, ctx: ExecutionContext) => {
    const req: AuthFastifyRequest = ctx.switchToHttp().getRequest();
    const permissions = req.userPermissions;
    if (!permissions) {
      throw Fail(
        FT.Internal,
        undefined,
        'Permissions are missing from request',
      );
    }

    return permissions.includes(data);
  },
);

export const GetPermissions = createParamDecorator(
  (data: Permission, ctx: ExecutionContext) => {
    const req: AuthFastifyRequest = ctx.switchToHttp().getRequest();
    const permissions = req.userPermissions;
    if (!permissions) {
      throw Fail(
        FT.Internal,
        undefined,
        'Permissions are missing from request',
      );
    }

    return permissions;
  },
);
