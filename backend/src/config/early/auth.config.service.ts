import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static.js';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getDefaultAdminPassword(): string {
    return ParseString(
      this.configService.get(`${EnvPrefix}ADMIN_PASSWORD`),
      'picsur',
    );
  }
}
