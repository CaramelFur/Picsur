import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import {
    AsyncFailable,
    ThrowIfFailed,
} from 'picsur-shared/dist/types/failable';
import { UserDbService } from '../../../collections/user-db/user-db.service.js';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer.js';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UserDbService) {
    super();
  }

  async validate(username: string, password: string): AsyncFailable<EUser> {
    const start = Date.now();
    // All this does is call the usersservice authenticate for authentication
    const user = await this.usersService.authenticate(username, password);

    // Wait atleast 500ms
    const wait = 450 - (Date.now() - start);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));

    return EUserBackend2EUser(ThrowIfFailed(user));
  }
}
