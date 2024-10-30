import fastifyHelmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import fastifyReplyFrom from '@fastify/reply-from';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module.js';
import { HostConfigService } from './config/early/host.config.service.js';
import { MainExceptionFilter } from './layers/exception/exception.filter.js';
import { SuccessInterceptor } from './layers/success/success.interceptor.js';
import { PicsurThrottlerGuard } from './layers/throttler/PicsurThrottler.guard.js';
import { ZodValidationPipe } from './layers/validate/zod-validator.pipe.js';
import { PicsurLoggerService } from './logger/logger.service.js';
import { MainAuthGuard } from './managers/auth/guards/main.guard.js';
import { HelmetOptions } from './security.js';

async function bootstrap() {
  const isProduction = process.env['PICSUR_PRODUCTION'] !== undefined;

  // Create fasify
  const fastifyAdapter = new FastifyAdapter({
    trustProxy: [
      '127.0.0.0/8',
      '10.0.0.0/8',
      '172.16.0.0/12',
      '192.168.0.0/16',
    ],
  });
  // TODO: generic error messages
  await fastifyAdapter.register(multipart as any);
  await fastifyAdapter.register(fastifyHelmet as any, HelmetOptions);
  await fastifyAdapter.register(fastifyReplyFrom as any);

  // Create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: isProduction,
      autoFlushLogs: true,
    },
  );

  // Configure logger
  app.useLogger(app.get(PicsurLoggerService));
  app.flushLogs();

  app.useGlobalFilters(app.get(MainExceptionFilter));
  app.useGlobalInterceptors(app.get(SuccessInterceptor));
  app.useGlobalPipes(app.get(ZodValidationPipe));

  app.useGlobalGuards(app.get(PicsurThrottlerGuard), app.get(MainAuthGuard));

  // Start app
  const hostConfigService = app.get(HostConfigService);
  await app.listen(hostConfigService.getPort(), hostConfigService.getHost());
}

bootstrap().catch(console.error);
