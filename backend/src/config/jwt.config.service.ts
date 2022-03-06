import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvJwtConfigService {
  constructor(private configService: ConfigService) {}

  public getJwtSecret(): string | undefined {
    return this.configService.get<string>('JWT_SECRET');
  }

  public getJwtExpiresIn(): string | undefined {
    return this.configService.get<string>('JWT_EXPIRES_IN');
  }
}
