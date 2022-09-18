import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Logger } from '@nestjs/common';
import type { Queue } from 'bull';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { ReturnsAnything } from '../../../decorators/returns.decorator';

@Controller('api/experiment')
@NoPermissions()
export class ExperimentController {
  private readonly logger = new Logger(ExperimentController.name);

  constructor(
    @InjectQueue('image-ingest') private readonly ingestQueue: Queue,
  ) {
    this.logger.log('experiment consumer started');
    this.logger.error('experiment consumer started');
    console.log(this.logger);
  }

  @Get()
  @ReturnsAnything()
  async testRoute(): Promise<any> {
    console.log('Create job');
    const job = await this.ingestQueue.add({
      foo: Buffer.from('aaaaaheleool'),
    });
    console.log('Job created', job.id);

    const result = await job.finished();

    console.log('Job finished', result);

    return 'ok';
  }
}
