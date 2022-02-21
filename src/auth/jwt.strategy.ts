import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import Config from 'src/env';
import { validate } from 'class-validator';
import { JwtDataDto } from './auth.dto';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.jwt.secret,
    });
  }

  async validate(payload: any): Promise<User> {
    const jwt = plainToClass(JwtDataDto, payload);

    const errors = await validate(jwt);
    if (errors.length > 0) {
      this.logger.warn(`Invalid JWT payload: ${JSON.stringify(payload)}`);
      throw new UnauthorizedException();
    }

    return jwt.user;
  }
}
