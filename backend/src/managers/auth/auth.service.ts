import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { JwtDataDto } from 'picsur-shared/dist/dto/jwt.dto';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { EUserBackend } from '../../models/entities/user.entity';

@Injectable()
export class AuthManagerService {
  private readonly logger = new Logger('AuthService');

  constructor(private jwtService: JwtService) {}

  async createToken(user: EUserBackend): Promise<string> {
    const jwtData: JwtDataDto = plainToClass(JwtDataDto, {
      user: {
        username: user.username,
        roles: user.roles,
      },
    });

    // Validate to be sure, this makes client experience better
    // in case of any failures
    const errors = await strictValidate(jwtData);
    if (errors.length > 0) {
      this.logger.warn(errors);
      throw new Error('Invalid jwt token generated');
    }

    return this.jwtService.signAsync(instanceToPlain(jwtData));
  }
}
