import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { MainExceptionFilter } from './exception/exception.filter.js';
import { SuccessInterceptor } from './success/success.interceptor.js';
import { PicsurThrottlerGuard } from './throttler/PicsurThrottler.guard.js';
import { ZodValidationPipe } from './validate/zod-validator.pipe.js';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 60,
          ttl: 60,
        },
      ],
    }),
  ],
  providers: [
    PicsurThrottlerGuard,
    MainExceptionFilter,
    SuccessInterceptor,
    ZodValidationPipe,
  ],
  exports: [
    PicsurThrottlerGuard,
    MainExceptionFilter,
    SuccessInterceptor,
    ZodValidationPipe,
  ],
})
export class PicsurLayersModule {}
