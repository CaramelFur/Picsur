import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { EUser, EUserSchema } from 'picsur-shared/dist/entities/user.entity';
import {
    AsyncFailable,
    FT,
    Fail,
    Failable,
    HasFailed,
    ThrowIfFailed,
} from 'picsur-shared/dist/types/failable';
import { makeUnique } from 'picsur-shared/dist/util/unique';
import { UserDbService } from '../../../collections/user-db/user-db.service.js';
import { Permissions } from '../../../models/constants/permissions.const.js';
import { isPermissionsArray } from '../../../models/validators/permissions.validator.js';

// This guard extends both the jwt authenticator and the guest authenticator
// The order matters here, because this results in the guest authenticator being used as a fallback
// This way a user will get his own account when logged in, but received guest permissions when not

@Injectable()
export class MainAuthGuard extends AuthGuard(['apikey', 'jwt', 'guest']) {
  private readonly logger = new Logger(MainAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UserDbService,
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // Sanity check
    const result = await super.canActivate(context);
    if (result !== true) {
      throw Fail(
        FT.Internal,
        undefined,
        'Main Auth has denied access, this should not happen',
      );
    }

    const unsafeUser: EUser = context.switchToHttp().getRequest().user;

    const user = ThrowIfFailed(await this.validateUser(unsafeUser));

    if (!user.id) {
      throw Fail(
        FT.Internal,
        undefined,
        'User has no id, this should not happen',
      );
    }

    // These are the permissions required to access the route
    const permissions = this.extractPermissions(context);
    if (HasFailed(permissions)) {
      throw Fail(
        FT.Internal,
        undefined,
        'Fetching route permission failed: ' + permissions.getReason(),
      );
    }

    // These are the permissions the user has
    const userPermissions = await this.usersService.getPermissions(user.id);
    if (HasFailed(userPermissions)) {
      throw userPermissions;
    }

    context.switchToHttp().getRequest().userPermissions = userPermissions;
    context.switchToHttp().getRequest().user = user;

    if (permissions.every((permission) => userPermissions.includes(permission)))
      return true;
    else throw Fail(FT.Permission, 'Permission denied');
  }

  private extractPermissions(context: ExecutionContext): Failable<Permissions> {
    const handlerName = context.getHandler().name;
    // Fall back to class permissions if none on function
    // But function has higher priority than class
    const permissionsHandler: Permissions | undefined =
      this.reflector.get<Permissions>('permissions', context.getHandler());
    const permissionsClass: Permissions | undefined =
      this.reflector.get<Permissions>('permissions', context.getClass());

    if (permissionsHandler === undefined && permissionsClass === undefined) {
      return Fail(
        FT.Internal,
        undefined,
        `${handlerName} does not have any permissions defined, denying access`,
      );
    }

    const permissions = makeUnique([
      ...(permissionsHandler ?? []),
      ...(permissionsClass ?? []),
    ]);

    if (!isPermissionsArray(permissions))
      return Fail(
        FT.Internal,
        undefined,
        `Permissions for ${handlerName} is not a string array`,
      );

    return permissions;
  }

  private async validateUser(user: EUser): AsyncFailable<EUser> {
    const result = EUserSchema.safeParse(user);
    if (!result.success) {
      return Fail(
        FT.Internal,
        undefined,
        `Invalid user object, where it should always be valid: ${result.error}`,
      );
    }

    return result.data;
  }
}
