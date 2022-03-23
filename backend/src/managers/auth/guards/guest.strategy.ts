import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Strategy } from 'passport-strategy';
import { ParsedQs } from 'qs';
import { GuestService } from '../guest.service';

type ReqType = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
>;

class GuestPassportStrategy extends Strategy {
  async validate(req: ReqType): Promise<any> {
    return undefined;
  }

  override async authenticate(req: ReqType, options?: any) {
    const user = await this.validate(req);
    this.success(user);
  }
}

@Injectable()
export class GuestStrategy extends PassportStrategy(
  GuestPassportStrategy,
  'guest',
) {
  private readonly logger = new Logger('GuestStrategy');

  constructor(private guestService: GuestService) {
    super();
  }

  override async validate(payload: any) {
    return await this.guestService.getGuestUser();
  }
}
