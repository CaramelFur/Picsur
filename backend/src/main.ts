import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = resolve(dirname(fileURLToPath(import.meta.url)));

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import * as multipart from 'fastify-multipart';
import { FrontendMiddleware } from './middleware/frontend.middleware';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(multipart as any);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  await app.listen(3000);
}

bootstrap().catch(console.error);
