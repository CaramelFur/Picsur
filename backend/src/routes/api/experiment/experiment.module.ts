import { Module } from '@nestjs/common';
import { PicsurLoggerModule } from '../../../logger/logger.module';
import { ImageManagerModule } from '../../../managers/image/image-manager.module';
import { ExperimentController } from './experiment.controller';

// This is comletely useless module, but is used for testing
// TODO: remove when out of beta

@Module({
  imports: [ImageManagerModule, PicsurLoggerModule],
  controllers: [ExperimentController]
})
export class ExperimentModule {}
