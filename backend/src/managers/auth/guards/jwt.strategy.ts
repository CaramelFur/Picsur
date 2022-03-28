import {
  Inject,
  Injectable,
  Logger
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtDataDto } from 'picsur-shared/dist/dto/jwt.dto';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { EUserBackend } from '../../../models/entities/user.entity';

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

  async validate(payload: any): Promise<EUserBackend | false> {
    const jwt = plainToClass(JwtDataDto, payload);

    // This then validates the data inside the jwt token
    const errors = await strictValidate(jwt);
    if (errors.length > 0) {
      this.logger.warn(errors);
      return false;
    }

    // And return the user
    return jwt.user;
  }
}
