import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthConfigService } from './auth.config.service';
import { EarlyJwtConfigService } from './earlyjwt.config.service';
import { HostConfigService } from './host.config.service';
import { MultipartConfigService } from './multipart.config.service';
import { ServeStaticConfigService } from './servestatic.config.service';
import { TypeOrmConfigService } from './typeorm.config.service';

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
  ],
  exports: [
    ConfigModule,
    EarlyJwtConfigService,
    TypeOrmConfigService,
    ServeStaticConfigService,
    HostConfigService,
    AuthConfigService,
    MultipartConfigService,
  ],
})
export class EarlyConfigModule {}
