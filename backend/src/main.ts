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
import Config from './env';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // Todo: generic error messages
  fastifyAdapter.register(multipart as any);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalFilters(new MainExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true, forbidUnknownValues: true }));
  await app.listen(Config.main.port, Config.main.host);
}

bootstrap().catch(console.error);
