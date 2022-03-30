import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import * as multipart from 'fastify-multipart';
import { ValidateOptions } from 'picsur-shared/dist/util/validate';
import { AppModule } from './app.module';
import { UsersService } from './collections/userdb/userdb.service';
import { HostConfigService } from './config/early/host.config.service';
import { MainExceptionFilter } from './layers/httpexception/httpexception.filter';
import { SuccessInterceptor } from './layers/success/success.interceptor';
import { PicsurLoggerService } from './logger/logger.service';
import { MainAuthGuard } from './managers/auth/guards/main.guard';

async function bootstrap() {
  // Create fasify
  const fastifyAdapter = new FastifyAdapter();
  // TODO: generic error messages
  fastifyAdapter.register(multipart as any);

  // Create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
    },
  );

  // Configure nest app
  app.useGlobalFilters(new MainExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(new ValidationPipe(ValidateOptions));
  app.useGlobalGuards(
    new MainAuthGuard(
      app.get(Reflector),
      app.get(UsersService),
    ),
  );

  // Configure logger
  app.useLogger(app.get(PicsurLoggerService));

  // Start app
  const hostConfigService = app.get(HostConfigService);
  await app.listen(hostConfigService.getPort(), hostConfigService.getHost());
}

bootstrap().catch(console.error);
