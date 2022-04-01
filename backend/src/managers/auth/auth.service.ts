import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { JwtDataDto } from 'picsur-shared/dist/dto/jwt.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { EUserBackend } from '../../models/entities/user.entity';

@Injectable()
export class AuthManagerService {
  private readonly logger = new Logger('AuthService');

  constructor(private jwtService: JwtService) {}

  async createToken(user: EUserBackend): AsyncFailable<string> {
    const jwtData: JwtDataDto = plainToClass(JwtDataDto, {
      user,
    });

    // Validate to be sure, this makes client experience better
    // in case of any failures
    const errors = await strictValidate(jwtData);
    if (errors.length > 0) {
      return Fail('Invalid JWT: ' + errors);
    }

    try {
      return await this.jwtService.signAsync(instanceToPlain(jwtData));
    } catch (e) {
      return Fail("Couldn't create JWT: " + e);
    }
  }
}
