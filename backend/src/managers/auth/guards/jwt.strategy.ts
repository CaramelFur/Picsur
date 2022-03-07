import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtDataDto } from 'picsur-shared/dist/dto/auth.dto';
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

  async validate(payload: any): Promise<EUserBackend> {
    const jwt = plainToClass(JwtDataDto, payload);

    const errors = await validate(jwt, {
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      this.logger.warn(errors);
      throw new UnauthorizedException();
    }

    return jwt.user;
  }
}
