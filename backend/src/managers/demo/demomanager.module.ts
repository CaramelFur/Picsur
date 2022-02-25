import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ImageDBModule } from '../../collections/imagedb/imagedb.module';
import Config from '../../env';
import { DemoManagerService } from './demomanager.service';

@Module({
  imports: [ImageDBModule],
  providers: [DemoManagerService],
})
export class DemoManagerModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('DemoManagerModule');

  constructor(private readonly demoManagerService: DemoManagerService) {}

  private interval: NodeJS.Timeout;

  onModuleInit() {
    if (Config.demo.enabled) {
      this.logger.log('Demo mode enabled');

      this.interval = setInterval(
        this.demoManagerService.execute.bind(this.demoManagerService),
        Config.demo.interval,
      );
    }
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
