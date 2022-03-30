import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { Fail, Failable, HasFailed } from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { Permissions } from '../../../models/dto/permissions.dto';
import { EUserBackend } from '../../../models/entities/user.entity';
import { isPermissionsArray } from '../../../models/validators/permissions.validator';

// This guard extends both the jwt authenticator and the guest authenticator
// The order matters here, because this results in the guest authenticator being used as a fallback
// This way a user will get his own account when logged in, but received guest permissions when not

@Injectable()
export class MainAuthGuard extends AuthGuard(['jwt', 'guest']) {
  private readonly logger = new Logger('MainAuthGuard');

  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    // Sanity check
    const result = await super.canActivate(context);
    if (result !== true) {
      this.logger.error('Main Auth has denied access, this should not happen');
      throw new InternalServerErrorException();
    }

    const user = await this.validateUser(
      context.switchToHttp().getRequest().user,
    );

    // These are the permissions required to access the route
    const permissions = this.extractPermissions(context);
    if (HasFailed(permissions)) {
      this.logger.warn('Route Permissions: ' + permissions.getReason());
      throw new InternalServerErrorException();
    }

    // These are the permissions the user has
    const userPermissions = await this.usersService.getPermissions(user);
    if (HasFailed(userPermissions)) {
      this.logger.warn('User Permissions: ' + userPermissions.getReason());
      throw new InternalServerErrorException();
    }

    if (permissions.every((permission) => userPermissions.includes(permission)))
      return true;
    else throw new ForbiddenException('Permission denied');
  }

  private extractPermissions(context: ExecutionContext): Failable<Permissions> {
    const handlerName = context.getHandler().name;
    // Fall back to class permissions if none on function
    // But function has higher priority than class
    const permissions =
      this.reflector.get<Permissions>('permissions', context.getHandler()) ??
      this.reflector.get<Permissions>('permissions', context.getClass());

    if (permissions === undefined)
      return Fail(
        `${handlerName} does not have any permissions defined, denying access`,
      );

    if (!isPermissionsArray(permissions))
      return Fail(`Permissions for ${handlerName} is not a string array`);

    return permissions;
  }

  private async validateUser(user: EUserBackend): Promise<EUserBackend> {
    const userClass = plainToClass(EUserBackend, user);
    const errors = await strictValidate(userClass);

    if (errors.length > 0) {
      this.logger.error(
        'Invalid user object, where it should always be valid: ' + errors,
      );
      throw new InternalServerErrorException();
    }
    return userClass;
  }
}
