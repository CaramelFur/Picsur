import { Module } from '@nestjs/common';
import { ApiKeysModule } from './apikeys/apikeys.module.js';
import { ExperimentModule } from './experiment/experiment.module.js';
import { InfoModule } from './info/info.module.js';
import { PrefModule } from './pref/pref.module.js';
import { RolesApiModule } from './roles/roles.module.js';
import { UsageApiModule } from './usage/usage.module.js';
import { UserApiModule } from './user/user.module.js';

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
