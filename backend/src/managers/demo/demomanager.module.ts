import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ImageDBModule } from '../../collections/imagedb/imagedb.module';
import { RolesModule } from '../../collections/roledb/roledb.module';
import { PicsurConfigModule } from '../../config/config.module';
import { HostConfigService } from '../../config/host.config.service';
import { DemoManagerService } from './demomanager.service';

@Module({
  imports: [ImageDBModule, PicsurConfigModule, RolesModule],
  providers: [DemoManagerService],
})
export class DemoManagerModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('DemoManagerModule');

  constructor(
    private readonly demoManagerService: DemoManagerService,
    private hostConfigService: HostConfigService,
  ) {}

  private interval: NodeJS.Timeout;

  private async setupDemoMode() {
    this.demoManagerService.setupRoles();
    this.interval = setInterval(
      this.demoManagerService.execute.bind(this.demoManagerService),
      this.hostConfigService.getDemoInterval(),
    );
  }

  async onModuleInit() {
    if (this.hostConfigService.isDemo()) {
      this.logger.log('Demo mode enabled');
      await this.setupDemoMode();
    }
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
