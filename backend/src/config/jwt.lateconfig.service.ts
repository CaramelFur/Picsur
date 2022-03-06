import { FactoryProvider, Injectable, Logger } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../collections/syspreferencesdb/syspreferencedb.service';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger('JwtConfigService');

  constructor(private prefService: SysPreferenceService) {}

  public async getJwtSecret(): Promise<string> {
    const secret = await this.prefService.getPreference('jwt_secret');
    if (HasFailed(secret)) {
      throw new Error('JWT secret could not be retrieved');
    }

    this.logger.debug('JWT secret: ' + secret.value);
    return secret.value;
  }

  public async getJwtExpiresIn(): Promise<string> {
    const expiresIn = await this.prefService.getPreference('jwt_expires_in');
    if (HasFailed(expiresIn)) {
      throw new Error('JWT expiresIn could not be retrieved');
    }

    this.logger.debug('JWT expiresIn: ' + expiresIn.value);
    return expiresIn.value;
  }

  public async createJwtOptions(): Promise<JwtModuleOptions> {
    return {
      secret: await this.getJwtSecret(),
      signOptions: {
        expiresIn: await this.getJwtExpiresIn(),
      },
    };
  }
}

export const JwtSecretProvider: FactoryProvider<Promise<string>> = {
  provide: 'JWT_SECRET',
  useFactory: async (jwtConfigService: JwtConfigService) => {
    return await jwtConfigService.getJwtSecret();
  },
  inject: [JwtConfigService],
};
