import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthConfigService } from './auth.config.service.js';
import { EarlyJwtConfigService } from './early-jwt.config.service.js';
import { HostConfigService } from './host.config.service.js';
import { MultipartConfigService } from './multipart.config.service.js';
import { S3ConfigService } from './s3.config.service.js';
import { ServeStaticConfigService } from './serve-static.config.service.js';
import { TypeOrmConfigService } from './type-orm.config.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvVars: true,
      cache: true,
    }),
  ],
  providers: [
    EarlyJwtConfigService,
    TypeOrmConfigService,
    ServeStaticConfigService,
    HostConfigService,
    AuthConfigService,
    MultipartConfigService,
    S3ConfigService,
  ],
  exports: [
    ConfigModule,
    EarlyJwtConfigService,
    TypeOrmConfigService,
    ServeStaticConfigService,
    HostConfigService,
    AuthConfigService,
    MultipartConfigService,
    S3ConfigService,
  ],
})
export class EarlyConfigModule {}
