import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import * as multipart from 'fastify-multipart';
import { AppModule } from './app.module';
import { HostConfigService } from './config/host.config.service';
import { MainExceptionFilter } from './layers/httpexception/httpexception.filter';
import { SuccessInterceptor } from './layers/success/success.interceptor';
import { PicsurLoggerService } from './logger/logger.service';
import { MainAuthGuard } from './managers/auth/guards/main.guard';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // TODO: generic error messages
  fastifyAdapter.register(multipart as any);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
    },
  );
  app.useGlobalFilters(new MainExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalGuards(new MainAuthGuard(new Reflector()));

  app.useLogger(app.get(PicsurLoggerService));

  const hostConfigService = app.get(HostConfigService);
  await app.listen(hostConfigService.getPort(), hostConfigService.getHost());
}

bootstrap().catch(console.error);
