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

  constructor(@Inject('JWT_SECRET') private jwtSecret: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any): Promise<EUserBackend | false> {
    const jwt = plainToClass(JwtDataDto, payload);

    const errors = await strictValidate(jwt);

    if (errors.length > 0) {
      this.logger.warn(errors);
      return false;
    }

    return jwt.user;
  }
}
