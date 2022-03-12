import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { JwtDataDto } from 'picsur-shared/dist/dto/auth.dto';
import { EUserBackend } from '../../models/entities/user.entity';

@Injectable()
export class AuthManagerService {
  private readonly logger = new Logger('AuthService');

  constructor(private jwtService: JwtService) {}

  async createToken(user: EUserBackend): Promise<string> {
    const jwtData: JwtDataDto = plainToClass(JwtDataDto, {
      user,
    });

    const errors = await validate(jwtData, { forbidUnknownValues: true });
    if (errors.length > 0) {
      this.logger.warn(errors);
      throw new Error('Invalid jwt token generated');
    }

    return this.jwtService.signAsync(instanceToPlain(jwtData));
  }
}
