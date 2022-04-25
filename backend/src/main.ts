import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import fastifyHelmet from 'fastify-helmet';
import * as multipart from 'fastify-multipart';
import { AppModule } from './app.module';
import { UsersService } from './collections/user-db/user-db.service';
import { HostConfigService } from './config/early/host.config.service';
import { MainExceptionFilter } from './layers/exception/exception.filter';
import { SuccessInterceptor } from './layers/success/success.interceptor';
import { ZodValidationPipe } from './layers/validate/zod-validator.pipe';
import { PicsurLoggerService } from './logger/logger.service';
import { MainAuthGuard } from './managers/auth/guards/main.guard';
import { HelmetOptions } from './security';

async function bootstrap() {
  // Create fasify
  const fastifyAdapter = new FastifyAdapter();
  // TODO: generic error messages
  await fastifyAdapter.register(multipart as any);
  await fastifyAdapter.register(fastifyHelmet, HelmetOptions);

  // Create nest app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
    },
  );

  app.useGlobalFilters(new MainExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalGuards(
    new MainAuthGuard(app.get(Reflector), app.get(UsersService)),
  );

  // Configure logger
  app.useLogger(app.get(PicsurLoggerService));

  // Start app
  const hostConfigService = app.get(HostConfigService);
  await app.listen(hostConfigService.getPort(), hostConfigService.getHost());
}

bootstrap().catch(console.error);
