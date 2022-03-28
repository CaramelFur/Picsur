import { Injectable } from '@nestjs/common';
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
  // Will be overridden by the nest implementation
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
  constructor(private guestService: GuestService) {
    super();
  }

  // Return the guest user created by the guestservice
  override async validate(payload: any) {
    return await this.guestService.getGuestUser();
  }
}
