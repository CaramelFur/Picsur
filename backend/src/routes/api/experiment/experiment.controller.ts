import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import type { Queue } from 'bull';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { ReturnsAnything } from '../../../decorators/returns.decorator';

@Controller('api/experiment')
@NoPermissions()
export class ExperimentController {
  constructor(

    @InjectQueue('image-ingest') private readonly ingestQueue: Queue,
  ) {}

  @Get()
  @ReturnsAnything()
  async testRoute(): Promise<any> {
    this.ingestQueue.add({ foo: Buffer.from("aaaaaheleool") });


    return 'ok';
  }
}
