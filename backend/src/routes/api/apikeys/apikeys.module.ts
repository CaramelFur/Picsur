import { Module } from '@nestjs/common';
import { ApiKeyDbModule } from '../../../collections/apikey-db/apikey-db.module.js';
import { ApiKeysController } from './apikeys.controller.js';

@Module({
  imports: [ApiKeyDbModule],
  controllers: [ApiKeysController],
})
export class ApiKeysModule {}
