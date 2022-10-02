import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthConfigService } from './auth.config.service';
import { BullConfigService } from './bull.config.service';
import { EarlyJwtConfigService } from './early-jwt.config.service';
import { HostConfigService } from './host.config.service';
import { MultipartConfigService } from './multipart.config.service';
import { RedisConfigService } from './redis.config.service';
import { S3ConfigService } from './s3.config.service';
import { ServeStaticConfigService } from './serve-static.config.service';
import { TypeOrmConfigService } from './type-orm.config.service';

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
    RedisConfigService,
    BullConfigService,
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
    RedisConfigService,
    BullConfigService,
    S3ConfigService,
  ],
})
export class EarlyConfigModule {}
