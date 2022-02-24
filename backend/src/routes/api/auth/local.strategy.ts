import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../../collections/userdb/user.dto';
import { AsyncFailable, HasFailed } from 'imagur-shared/dist/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<User> {
    const userEntity = await this.authService.authenticate(username, password);
    if (HasFailed(userEntity)) {
      throw new UnauthorizedException();
    }
    const user: User = {
      username: userEntity.username,
      isAdmin: userEntity.isAdmin,
    };

    return user;
  }
}
