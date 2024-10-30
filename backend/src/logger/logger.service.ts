import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { HostConfigService } from '../config/early/host.config.service.js';

@Injectable({ scope: Scope.DEFAULT })
export class PicsurLoggerService extends ConsoleLogger {
  constructor(hostService: HostConfigService) {
    super();
    if (hostService.isProduction() && !hostService.isVerbose()) {
      super.setLogLevels(['error', 'warn', 'log']);
    }
  }
}
