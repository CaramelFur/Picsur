import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtPassportStrategy } from 'passport-jwt';
import { JwtDataSchema } from 'picsur-shared/dist/dto/jwt.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { ThrowIfFailed } from 'picsur-shared/dist/types/failable';
import { UserDbService } from '../../../collections/user-db/user-db.service.js';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    @Inject('JWT_SECRET') jwtSecret: string,
    private readonly usersService: UserDbService,
  ) {
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

    const backendUser = ThrowIfFailed(
      await this.usersService.findOne(result.data.uid),
    );

    // And return the user
    return EUserBackend2EUser(backendUser);
  }
}
