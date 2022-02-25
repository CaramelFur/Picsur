import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AsyncFailable, HasFailed } from 'imagur-shared/dist/types';
import { User } from 'imagur-shared/dist/dto/user.dto';

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
