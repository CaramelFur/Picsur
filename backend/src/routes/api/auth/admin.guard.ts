import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { EUser } from 'picsur-shared/dist/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger('AdminGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = plainToClass(EUser, request.user);
    const errors = await validate(user, {forbidUnknownValues: true});
    if (errors.length > 0) {
      this.logger.warn(errors);
      return false;
    }

    return user.isAdmin;
  }
}
