import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ImageDBModule } from '../../collections/imagedb/imagedb.module';
import { RolesModule } from '../../collections/roledb/roledb.module';
import { EarlyConfigModule } from '../../config/early/earlyconfig.module';
import { HostConfigService } from '../../config/early/host.config.service';
import { DemoManagerService } from './demomanager.service';

@Module({
  imports: [ImageDBModule, EarlyConfigModule, RolesModule],
  providers: [DemoManagerService],
})
export class DemoManagerModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('DemoManagerModule');
  private interval: NodeJS.Timeout;

  constructor(
    private readonly demoManagerService: DemoManagerService,
    private hostConfigService: HostConfigService,
  ) {}

  async onModuleInit() {
    if (this.hostConfigService.isDemo()) {
      this.logger.log('Demo mode enabled');
      await this.setupDemoMode();
    }
  }

  private async setupDemoMode() {
    this.demoManagerService.setupRoles();
    this.interval = setInterval(
      // Run demoManagerService.execute() every interval
      this.demoManagerService.execute.bind(this.demoManagerService),
      this.hostConfigService.getDemoInterval(),
    );
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
