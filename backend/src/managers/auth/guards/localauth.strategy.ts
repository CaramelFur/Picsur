import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { EUserBackend } from '../../../models/entities/user.entity';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<EUserBackend> {
    const user = await this.usersService.authenticate(username, password);
    if (HasFailed(user)) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
