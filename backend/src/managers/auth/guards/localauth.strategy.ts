import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { EUserBackend } from '../../../models/entities/user.entity';
import { AuthManagerService } from '../auth.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthManagerService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<EUserBackend> {
    const user = await this.authService.authenticate(username, password);
    if (HasFailed(user)) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
