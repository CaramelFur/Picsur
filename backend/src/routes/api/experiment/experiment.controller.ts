import { Controller, Get, Logger } from '@nestjs/common';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { ReturnsAnything } from '../../../decorators/returns.decorator';

@Controller('api/experiment')
@NoPermissions()
export class ExperimentController {
  private readonly logger = new Logger(ExperimentController.name);

  constructor() {}

  @Get()
  @ReturnsAnything()
  async testRoute(): Promise<any> {
    return 'ok';
  }
}
