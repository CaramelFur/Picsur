import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import cors from 'cors';
import { IncomingMessage, ServerResponse } from 'http';
import { BullConfigService } from './config/early/bull.config.service';
import { EarlyConfigModule } from './config/early/early-config.module';
import { ServeStaticConfigService } from './config/early/serve-static.config.service';
import { ConsumersModule } from './consumers/consumers.module';
import { DatabaseModule } from './database/database.module';
import { PicsurLayersModule } from './layers/PicsurLayers.module';
import { PicsurLoggerModule } from './logger/logger.module';
import { AuthManagerModule } from './managers/auth/auth.module';
import { DemoManagerModule } from './managers/demo/demo.module';
import { UsageManagerModule } from './managers/usage/usage.module';
import { PicsurRoutesModule } from './routes/routes.module';

const mainCorsConfig = cors({
  origin: '<origin>',
});

const imageCorsConfig = cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false,
  // A month
  maxAge: 30 * 24 * 60 * 60,
});

const imageCorsOverride = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function,
) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();
};

@Module({
  imports: [
    PicsurLoggerModule,
    ServeStaticModule.forRootAsync({
      useExisting: ServeStaticConfigService,
      imports: [EarlyConfigModule],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useExisting: BullConfigService,
      imports: [EarlyConfigModule],
    }),

    DatabaseModule,
    AuthManagerModule,
    UsageManagerModule,
    DemoManagerModule,
    PicsurRoutesModule,
    PicsurLayersModule,
    ConsumersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(mainCorsConfig).exclude('/i').forRoutes('/');
    consumer.apply(imageCorsConfig, imageCorsOverride).forRoutes('/i');
  }
}
