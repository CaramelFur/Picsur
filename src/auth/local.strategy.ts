import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AsyncFailable, HasFailed } from 'src/lib/maybe';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): AsyncFailable<UserEntity> {
    const user = await this.authService.authenticate(username, password);
    if (HasFailed(user)) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
