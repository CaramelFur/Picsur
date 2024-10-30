import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ParseInt, ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EntityList } from '../../database/entities/index.js';
import { MigrationList } from '../../database/migrations/index.js';
import { DefaultName, EnvPrefix } from '../config.static.js';
import { HostConfigService } from './host.config.service.js';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeOrmConfigService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly hostService: HostConfigService,
  ) {
    const varOptions = this.getTypeOrmServerOptions();

    this.logger.log('DB host: ' + varOptions.host);
    this.logger.log('DB port: ' + varOptions.port);
    this.logger.log('DB database: ' + varOptions.database);

    this.logger.verbose('DB username: ' + varOptions.username);
    this.logger.verbose('DB password: ' + varOptions.password);
  }

  public getTypeOrmServerOptions() {
    const varOptions = {
      host: ParseString(
        this.configService.get(`${EnvPrefix}DB_HOST`),
        'localhost',
      ),
      port: ParseInt(this.configService.get(`${EnvPrefix}DB_PORT`), 5432),
      username: ParseString(
        this.configService.get(`${EnvPrefix}DB_USERNAME`),
        DefaultName,
      ),
      password: ParseString(
        this.configService.get(`${EnvPrefix}DB_PASSWORD`),
        DefaultName,
      ),
      database: ParseString(
        this.configService.get(`${EnvPrefix}DB_DATABASE`),
        DefaultName,
      ),
    };
    return varOptions;
  }

  public createTypeOrmOptions() {
    const varOptions = this.getTypeOrmServerOptions();
    return {
      type: 'postgres' as const,
      synchronize: !this.hostService.isProduction(),

      migrationsRun: true,

      entities: EntityList,
      migrations: MigrationList,

      useUTC: true,

      cli: {
        migrationsDir: 'src/database/migrations',
        entitiesDir: 'src/database/entities',
      },

      ...varOptions,
    } as TypeOrmModuleOptions;
  }
}
