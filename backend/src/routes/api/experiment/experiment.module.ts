import { Module } from '@nestjs/common';
import { ExperimentController } from './experiment.controller';

// This is comletely useless module, but is used for testing
// TODO: remove when out of beta

@Module({
  controllers: [ExperimentController],
})
export class ExperimentModule {}
