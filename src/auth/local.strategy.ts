import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AsyncMaybe, Nothing } from 'src/lib/maybe';
import { UserEntity } from 'src/users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): AsyncMaybe<UserEntity> {
    const user = await this.authService.authenticate(username, password);
    if (user === Nothing) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
