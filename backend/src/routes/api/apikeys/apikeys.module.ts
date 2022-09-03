import { Module } from '@nestjs/common';
import { ApiKeyDbModule } from '../../../collections/apikey-db/apikey-db.module';
import { ApiKeysController } from './apikeys.controller';

@Module({
  imports: [ApiKeyDbModule],
  controllers: [ApiKeysController],
})
export class ApiKeysModule {}
