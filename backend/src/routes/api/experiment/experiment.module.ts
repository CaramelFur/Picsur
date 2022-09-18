import { Module } from '@nestjs/common';
import { PicsurLoggerModule } from '../../../logger/logger.module';
import { IngestManagerModule } from '../../../managers/ingest/ingest.module';
import { ExperimentController } from './experiment.controller';

// This is comletely useless module, but is used for testing
// TODO: remove when out of beta

@Module({
  imports: [IngestManagerModule, PicsurLoggerModule],
  controllers: [ExperimentController]
})
export class ExperimentModule {}
