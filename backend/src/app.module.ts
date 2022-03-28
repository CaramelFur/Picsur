import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EarlyConfigModule } from './config/early/earlyconfig.module';
import { ServeStaticConfigService } from './config/early/servestatic.config.service';
import { TypeOrmConfigService } from './config/early/typeorm.config.service';
import { PicsurLoggerModule } from './logger/logger.module';
import { AuthManagerModule } from './managers/auth/auth.module';
import { DemoManagerModule } from './managers/demo/demomanager.module';
import { PicsurRoutesModule } from './routes/routes.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [EarlyConfigModule],
    }),
    ServeStaticModule.forRootAsync({
      useExisting: ServeStaticConfigService,
      imports: [EarlyConfigModule],
    }),
    PicsurLoggerModule,
    AuthManagerModule,
    DemoManagerModule,
    PicsurRoutesModule,
  ],
})
export class AppModule {}
