import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import * as multipart from 'fastify-multipart';
import { MainExceptionFilter } from './layers/httpexception/httpexception.filter';
import { SuccessInterceptor } from './layers/success/success.interceptor';
import { HostConfigService } from './config/host.config.service';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // TODO: generic error messages
  fastifyAdapter.register(multipart as any);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalFilters(new MainExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      forbidUnknownValues: true,
    }),
  );

  const hostConfigService = app.get(HostConfigService);
  await app.listen(hostConfigService.getPort(), hostConfigService.getHost());
}

bootstrap().catch(console.error);
