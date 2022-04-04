import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<EUser> {
    // All this does is call the usersservice authenticate for authentication
    const user = await this.usersService.authenticate(username, password);
    if (HasFailed(user)) {
      throw new UnauthorizedException();
    }

    return EUserBackend2EUser(user);
  }
}
