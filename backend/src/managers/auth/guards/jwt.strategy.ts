import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtDataSchema } from 'picsur-shared/dist/dto/jwt.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger('JwtStrategy');

  constructor(@Inject('JWT_SECRET') jwtSecret: string) {
    // This will validate the jwt token itself
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<EUser | false> {
    const result = JwtDataSchema.safeParse(payload);
    if (!result.success) {
      this.logger.error('JWT could not be parsed: ' + result.error);
      return false;
    }

    // And return the user
    return result.data.user;
  }
}
