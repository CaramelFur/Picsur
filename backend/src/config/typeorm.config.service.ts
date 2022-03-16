import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EntityList } from '../models/entities';
import { DefaultName, EnvPrefix } from './config.static';
import { HostConfigService } from './host.config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger('TypeOrmConfigService');

  constructor(
    private configService: ConfigService,
    private hostService: HostConfigService,
  ) {
    const varOptions = this.getTypeOrmServerOptions();

    this.logger.debug('DB host: ' + varOptions.host);
    this.logger.debug('DB port: ' + varOptions.port);
    this.logger.debug('DB username: ' + varOptions.username);
    this.logger.debug('DB password: ' + varOptions.password);
    this.logger.debug('DB database: ' + varOptions.database);
  }

  public getTypeOrmServerOptions() {
    const varOptions = {
      host: this.configService.get<string>(`${EnvPrefix}DB_HOST`, 'localhost'),
      port: this.configService.get<number>(`${EnvPrefix}DB_PORT`, 5432),
      username: this.configService.get<string>(
        `${EnvPrefix}DB_USERNAME`,
        DefaultName,
      ),
      password: this.configService.get<string>(
        `${EnvPrefix}DB_PASSWORD`,
        DefaultName,
      ),
      database: this.configService.get<string>(
        `${EnvPrefix}DB_DATABASE`,
        DefaultName,
      ),
    };
    return varOptions;
  }

  public createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    const varOptions = this.getTypeOrmServerOptions();
    return {
      type: 'postgres',
      synchronize: !this.hostService.isProduction(),

      entities: EntityList,

      ...varOptions,
    };
  }
}
