import { Res, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import * as multipart from 'fastify-multipart';
import { MainExceptionFilter } from './layers/http-exception/http-exception.filter';
import { SuccessInterceptor } from './layers/success/success.interceptor';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // Todo: generic error messages
  fastifyAdapter.register(multipart as any);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );
  app.useGlobalFilters(new MainExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  await app.listen(3000);
}

bootstrap().catch(console.error);
