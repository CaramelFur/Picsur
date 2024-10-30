import { FactoryProvider, Injectable, Logger } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import ms from 'ms';
import { ThrowIfFailed } from 'picsur-shared/dist/types/failable';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service.js';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger(JwtConfigService.name);

  constructor(private readonly prefService: SysPreferenceDbService) {
    this.printDebug().catch(this.logger.error);
  }

  private async printDebug() {
    const secret = await this.getJwtSecret();
    const expiresIn = await this.getJwtExpiresIn();
    this.logger.verbose('JWT secret: ' + secret);
    this.logger.verbose('JWT expiresIn: ' + expiresIn);
  }

  public async getJwtSecret(): Promise<string> {
    const secret = ThrowIfFailed(
      await this.prefService.getStringPreference('jwt_secret'),
    );

    return secret;
  }

  public async getJwtExpiresIn(): Promise<number> {
    const expiresIn = ThrowIfFailed(
      await this.prefService.getStringPreference('jwt_expires_in'),
    );

    let milliseconds = ms(expiresIn as string);
    if (isNaN(milliseconds)) {
      milliseconds = 1000 * 60 * 60 * 24; // 1 day
    }

    return milliseconds / 1000;
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
