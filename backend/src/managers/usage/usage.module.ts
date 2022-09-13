import { Module } from '@nestjs/common';
import { PreferenceDbModule } from '../../collections/preference-db/preference-db.module';
import { UsageService } from './usage.service';

@Module({
  imports: [PreferenceDbModule],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageManagerModule {}
