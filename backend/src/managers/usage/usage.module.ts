import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
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
export class UsageManagerModule implements OnModuleInit {
  private readonly logger = new Logger(UsageManagerModule.name);

  constructor(
    private readonly usageService: UsageService,
    private readonly usageConfigService: UsageConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    if (!(await this.usageConfigService.getMetricsEnabled())) {
      this.logger.log('Telemetry is disabled');
    }

    const interval = setInterval(
      this.cronJob.bind(this),
      await this.usageConfigService.getMetricsInterval(),
    );
    this.schedulerRegistry.addInterval('usage', interval);

    this.cronJob();
  }

  private cronJob() {
    this.usageService.execute().catch((err) => {
      this.logger.warn(err);
    });
  }
}
