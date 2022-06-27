import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvPrefix } from '../config.static';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getDefaultAdminPassword(): string {
    return this.configService.get<string>(
      `${EnvPrefix}ADMIN_PASSWORD`,
      'admin',
    );
  }
}
