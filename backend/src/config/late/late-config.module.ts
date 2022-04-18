import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { PreferenceModule } from '../../collections/preference-db/preference-db.module';
import { SysPreferenceService } from '../../collections/preference-db/sys-preference-db.service';
import { EarlyConfigModule } from '../early/early-config.module';
import { EarlyJwtConfigService } from '../early/early-jwt.config.service';
import { JwtConfigService } from './jwt.config.service';

// This module contains all configservices that depend on the syspref module
// The syspref module can only be used when connected to the database
// Since the syspref module requires the database config, we need this seperate
// Otherwise we will create a circular depedency

@Module({
  imports: [PreferenceModule, EarlyConfigModule],
  providers: [JwtConfigService],
  exports: [JwtConfigService, EarlyConfigModule],
})
export class LateConfigModule implements OnModuleInit {
  private readonly logger = new Logger('LateConfigModule');

  constructor(
    private envJwtConfigService: EarlyJwtConfigService,
    private prefService: SysPreferenceService,
  ) {}

  async onModuleInit() {
    await this.ensureJwtDefaultsLoaded();
  }

  async ensureJwtDefaultsLoaded() {
    const envSecret = this.envJwtConfigService.getJwtSecret();
    const envExpiresIn = this.envJwtConfigService.getJwtExpiresIn();

    if (envSecret === undefined) {
      await this.prefService.getPreference('jwt_secret');
    } else {
      await this.prefService.setPreference('jwt_secret', envSecret);
    }

    if (envExpiresIn !== undefined) {
      await this.prefService.setPreference('jwt_expires_in', envExpiresIn);
    }
  }
}
