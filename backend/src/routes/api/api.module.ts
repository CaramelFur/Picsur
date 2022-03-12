import { Module } from '@nestjs/common';
import { UserApiModule } from './auth/user.module';
import { ExperimentModule } from './experiment/experiment.module';
import { InfoModule } from './info/info.module';
import { PrefModule } from './pref/pref.module';
import { RolesApiModule } from './roles/roles.module';

@Module({
  imports: [
    UserApiModule,
    PrefModule,
    ExperimentModule,
    InfoModule,
    RolesApiModule,
  ]
})
export class PicsurApiModule {}
