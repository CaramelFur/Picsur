import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ExperimentModule } from './experiment/experiment.module';
import { PrefModule } from './pref/pref.module';
import { InfoModule } from './info/info.module';

@Module({
  imports: [
    AuthModule,
    PrefModule,
    ExperimentModule,
    InfoModule,
  ]
})
export class PicsurApiModule {}
