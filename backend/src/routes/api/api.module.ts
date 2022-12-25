import { Module } from '@nestjs/common';
import { ApiKeysModule } from './apikeys/apikeys.module';
import { ExperimentModule } from './experiment/experiment.module';
import { InfoModule } from './info/info.module';
import { PrefModule } from './pref/pref.module';
import { RolesApiModule } from './roles/roles.module';
import { UsageApiModule } from './usage/usage.module';
import { UserApiModule } from './user/user.module';

@Module({
  imports: [
    UserApiModule,
    PrefModule,
    ExperimentModule,
    InfoModule,
    RolesApiModule,
    ApiKeysModule,
    UsageApiModule,
  ],
})
export class PicsurApiModule {}
