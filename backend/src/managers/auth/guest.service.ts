import { Injectable } from '@nestjs/common';
import { EUserBackend } from '../../models/entities/user.entity';

@Injectable()
export class GuestService {
  public createGuest(): EUserBackend {
    const guest = new EUserBackend();
    guest.roles = ['guest'];
    guest.username = 'guest';

    return guest;
  }
}
