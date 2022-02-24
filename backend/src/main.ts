import { Res, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import * as multipart from 'fastify-multipart';
import Config from './env';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  
  // Todo: generic error messages
  fastifyAdapter.register(multipart as any, {
    limits: {
      fieldNameSize: 128,
      fieldSize: 1024,
      fields: 16,
      fileSize: Config.limits.maxFileSize,
      files: 16,
    },
    logLevel: 'error',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  await app.listen(3000);
}

bootstrap().catch(console.error);
