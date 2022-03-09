import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Strategy } from 'passport-strategy';
import { ParsedQs } from 'qs';

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

  override authenticate(req: ReqType, options?: any): void {
    const user = this.validate(req);
    req['user'] = user;
    this.pass();
  }
}

@Injectable()
export class GuestStrategy extends PassportStrategy(
  GuestPassportStrategy,
  'guest',
) {
  private readonly logger = new Logger('GuestStrategy');

  override async validate(payload: any) {
    // TODO: add guest user
    return;
  }
}
