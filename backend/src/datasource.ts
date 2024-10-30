import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './config/early/type-orm.config.service.js';
import { DatabaseModule } from './database/database.module.js';

async function createDataSource() {
  // Create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    DatabaseModule,
    new FastifyAdapter(),
  );

  const configFactory = app.get(TypeOrmConfigService);
  const config = await configFactory.createTypeOrmOptions();

  return new DataSource(config as any);
}

export default createDataSource();
