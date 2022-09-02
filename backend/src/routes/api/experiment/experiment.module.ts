import { Module } from '@nestjs/common';
import { ApikeyDbModule } from '../../../collections/apikey-db/apikey-db.module';
import { ExperimentController } from './experiment.controller';

// This is comletely useless module, but is used for testing
// TODO: remove when out of beta

@Module({
  imports: [ApikeyDbModule],
  controllers: [ExperimentController],
})
export class ExperimentModule {}
