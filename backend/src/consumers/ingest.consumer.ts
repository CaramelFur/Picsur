import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';

@Processor('image-ingest')
export class IngestConsumer {
  private readonly logger = new Logger(IngestConsumer.name);

  @Process()
  async processJob(job: Job) {
    console.log('processJob', job);
  }

  @OnQueueError()
  async handleError(error: any) {
    this.logger.error(error);
  }
}
