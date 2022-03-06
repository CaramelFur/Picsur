import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  public getDefaultAdminPassword(): string {
    return this.configService.get<string>('DEFAULT_ADMIN_PASSWORD', 'admin');
  }

  public getDefaultAdminUsername(): string {
    return this.configService.get<string>('DEFAULT_ADMIN_USERNAME', 'admin');
  }
}
