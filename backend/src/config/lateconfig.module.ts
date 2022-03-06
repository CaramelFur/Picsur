import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { JwtConfigService } from './jwt.lateconfig.service';
import { SysPreferenceModule } from '../collections/syspreferencesdb/syspreferencedb.module';
import { PicsurConfigModule } from './config.module';
import { EnvJwtConfigService } from './jwt.config.service';
import { SysPreferenceService } from '../collections/syspreferencesdb/syspreferencedb.service';

// This module contains all configservices that depend on the syspref module
// The syspref module can only be used when connected to the database
// Since the syspref module requires the database config, we need this seperate
// Otherwise we will create a circular depedency

@Module({
  imports: [SysPreferenceModule, PicsurConfigModule],
  providers: [JwtConfigService],
  exports: [JwtConfigService, PicsurConfigModule],
})
export class PicsurLateConfigModule implements OnModuleInit {
  private readonly logger = new Logger('PicsurLateConfigModule');

  constructor(
    private envJwtConfigService: EnvJwtConfigService,
    private prefService: SysPreferenceService,
  ) {}

  async onModuleInit() {
    const secret = this.envJwtConfigService.getJwtSecret();
    const expiresIn = this.envJwtConfigService.getJwtExpiresIn();

    if (secret === undefined) {
      await this.prefService.getPreference('jwt_secret');
    } else {
      await this.prefService.setPreference('jwt_secret', secret);
    }

    if (expiresIn !== undefined) {
      await this.prefService.setPreference('jwt_expires_in', expiresIn);
    }
  }
}
