import { Module } from '@nestjs/common';
import { ExperimentController } from './experiment.controller';

@Module({
  controllers: [ExperimentController]
})
export class ExperimentModule {}
