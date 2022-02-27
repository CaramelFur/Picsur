import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { EUser } from 'picsur-shared/dist/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<EUser> {
    const user = await this.authService.authenticate(username, password);
    if (HasFailed(user)) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
