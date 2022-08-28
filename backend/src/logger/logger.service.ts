import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { HostConfigService } from '../config/early/host.config.service';

@Injectable({ scope: Scope.DEFAULT })
export class PicsurLoggerService extends ConsoleLogger {
  constructor(hostService: HostConfigService) {
    super();
    if (hostService.isProduction()) {
      super.setLogLevels(['error', 'warn', 'log']);
    }
  }
}
