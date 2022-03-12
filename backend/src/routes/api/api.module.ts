import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ExperimentModule } from './experiment/experiment.module';
import { InfoModule } from './info/info.module';
import { PrefModule } from './pref/pref.module';
import { RolesApiModule } from './roles/roles.module';

@Module({
  imports: [
    AuthModule,
    PrefModule,
    ExperimentModule,
    InfoModule,
    RolesApiModule,
  ]
})
export class PicsurApiModule {}
