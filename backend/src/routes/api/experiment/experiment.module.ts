import { Module } from '@nestjs/common';
import { ConsumersModule } from '../../../consumers/consumers.module';
import { ExperimentController } from './experiment.controller';

// This is comletely useless module, but is used for testing
// TODO: remove when out of beta

@Module({
  imports: [ConsumersModule],
  controllers: [ExperimentController]
})
export class ExperimentModule {}
