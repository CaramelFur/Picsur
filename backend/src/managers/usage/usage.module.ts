import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ImageDBModule } from '../../collections/image-db/image-db.module';
import { SystemStateDbModule } from '../../collections/system-state-db/system-state-db.module';
import { UserDbModule } from '../../collections/user-db/user-db.module';
import { LateConfigModule } from '../../config/late/late-config.module';
import { UsageConfigService } from '../../config/late/usage.config.service';
import { UsageService } from './usage.service';

@Module({
  imports: [LateConfigModule, SystemStateDbModule, ImageDBModule, UserDbModule],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageManagerModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UsageManagerModule.name);
  private interval: NodeJS.Timeout;

  constructor(
    private readonly usageService: UsageService,
    private readonly usageConfigService: UsageConfigService,
  ) {}

  async onModuleInit() {
    if (!(await this.usageConfigService.getMetricsEnabled())) {
      this.logger.log('Telemetry is disabled');
    }

    this.interval = setInterval(() => {
      this.usageService.execute().catch((err) => {
        this.logger.warn(err);
      });
    }, await this.usageConfigService.getMetricsInterval());

    this.usageService.execute().catch((err) => {
      this.logger.warn(err);
    });
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
