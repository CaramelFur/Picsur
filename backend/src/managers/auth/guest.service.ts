import { Injectable } from '@nestjs/common';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../collections/userdb/userdb.service';
import { EUserBackend } from '../../models/entities/user.entity';

@Injectable()
export class GuestService {
  private fallBackUser: EUserBackend;

  constructor(private usersService: UsersService) {
    this.fallBackUser = new EUserBackend();
    this.fallBackUser.roles = ['guest'];
    this.fallBackUser.username = 'guest';
  }

  public async getGuestUser(): Promise<EUserBackend> {
    const user = await this.usersService.findOne('guest');
    if (HasFailed(user)) {
      return this.fallBackUser;
    }

    return user;
  }
}
