import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { isArray, isEnum, isString, validate } from 'class-validator';
import { Roles, RolesList } from 'picsur-shared/dist/dto/roles.dto';
import { Fail, Failable, HasFailed } from 'picsur-shared/dist/types';
import { EUserBackend } from '../../../models/entities/user.entity';

@Injectable()
export class MainAuthGuard extends AuthGuard(['jwt', 'guest']) {
  private readonly logger = new Logger('MainAuthGuard');

  constructor(private reflector: Reflector) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = await super.canActivate(context);
    if (result !== true) {
      this.logger.error('Main Auth has denied access, this should not happen');
      return false;
    }

    const user = await this.validateUser(
      context.switchToHttp().getRequest().user,
    );

    const roles = this.extractRoles(context);
    if (HasFailed(roles)) {
      this.logger.warn(roles.getReason());
      return false;
    }

    // User must have all roles
    return roles.every((role) => user.roles.includes(role));
  }

  private extractRoles(context: ExecutionContext): Failable<Roles> {
    const handlerName = context.getHandler().name;
    const roles =
      this.reflector.get<Roles>('roles', context.getHandler()) ??
      this.reflector.get<Roles>('roles', context.getClass());

    if (roles === undefined) {
      return Fail(
        `${handlerName} does not have any roles defined, denying access`,
      );
    }

    if (!this.isRolesArray(roles)) {
      return Fail(`Roles for ${handlerName} is not a string array`);
    }

    return roles;
  }

  private isRolesArray(value: any): value is Roles {
    if (!isArray(value)) return false;
    if (!value.every((item: unknown) => isString(item))) return false;
    if (!value.every((item: string) => isEnum(item, RolesList))) return false;
    return true;
  }

  private async validateUser(user: EUserBackend): Promise<EUserBackend> {
    const userClass = plainToClass(EUserBackend, user);
    const errors = await validate(userClass, {
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      this.logger.error(
        'Invalid user object, where it should always be valid: ' + errors,
      );
      throw new InternalServerErrorException();
    }
    return userClass;
  }
}
