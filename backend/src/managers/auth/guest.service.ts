import { Injectable } from '@nestjs/common';
import { HasFailed } from 'picsur-shared/dist/types';
import { UserDbService } from '../../collections/user-db/user-db.service';
import { EUserBackend } from '../../database/entities/user.entity';

@Injectable()
export class GuestService {
  private fallBackUser: EUserBackend;

  constructor(private readonly usersService: UserDbService) {
    this.fallBackUser = new EUserBackend();
    this.fallBackUser.username = 'guest';
    this.fallBackUser.roles = ['guest'];
  }

  public async getGuestUser(): Promise<EUserBackend> {
    const user = await this.usersService.findByUsername('guest');
    if (HasFailed(user)) {
      return this.fallBackUser;
    }

    return user;
  }
}
