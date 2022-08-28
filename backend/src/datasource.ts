import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter, NestFastifyApplication
} from '@nestjs/platform-fastify';
import { DataSource, InstanceChecker } from 'typeorm';
import { TypeOrmConfigService } from './config/early/type-orm.config.service';
import { DatabaseModule } from './database/database.module';

// TODO, upgrade to a version beyond typeorm 3.8, cause 3.8 is bugged
// So here we monkeypatch 3.7
function patchAsyncDataSourceSetup() {
  const oldIsDataSource = InstanceChecker.isDataSource;
  InstanceChecker.isDataSource = function (obj: unknown): obj is DataSource {
    if (obj instanceof Promise) {
      return true;
    }
    return oldIsDataSource(obj);
  };
}
patchAsyncDataSourceSetup();

async function createDataSource() {
  // Create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    DatabaseModule,
    new FastifyAdapter(),
  );

  const configFactory = app.get(TypeOrmConfigService);
  const config = await configFactory.createTypeOrmOptions();

  return new DataSource(config);
}

export default createDataSource().catch(console.error);
