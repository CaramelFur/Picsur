import { Module, OnModuleInit } from '@nestjs/common';
import { ImageDBModule } from '../../collections/imagedb/imagedb.module';
import Config from '../../env';
import { DemoManagerService } from './demomanager.service';

@Module({
  imports: [ImageDBModule],
  providers: [DemoManagerService],
})
export class DemoManagerModule implements OnModuleInit {
  constructor(private readonly demoManagerService: DemoManagerService) {}

  private interval: NodeJS.Timeout;

  onModuleInit() {
    if (Config.demo.enabled) {
      setInterval(this.demoManagerService.execute, Config.demo.interval);
    }
  }
}
