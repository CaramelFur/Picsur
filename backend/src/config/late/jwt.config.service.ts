import { FactoryProvider, Injectable, Logger } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../../collections/preference-db/sys-preference-db.service';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger('JwtConfigService');

  constructor(private prefService: SysPreferenceService) {
    this.printDebug().catch(this.logger.error);
  }

  private async printDebug() {
    const secret = await this.getJwtSecret();
    const expiresIn = await this.getJwtExpiresIn();
    this.logger.debug('JWT secret: ' + secret);
    this.logger.debug('JWT expiresIn: ' + expiresIn);
  }

  public async getJwtSecret(): Promise<string> {
    const secret = await this.prefService.getStringPreference('jwt_secret');
    if (HasFailed(secret)) {
      throw new Error('JWT secret could not be retrieved');
    }
    return secret;
  }

  public async getJwtExpiresIn(): Promise<string> {
    const expiresIn = await this.prefService.getStringPreference(
      'jwt_expires_in',
    );
    if (HasFailed(expiresIn)) {
      throw new Error('JWT expiresIn could not be retrieved');
    }
    return expiresIn;
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
