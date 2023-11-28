import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { MainExceptionFilter } from './exception/exception.filter';
import { SuccessInterceptor } from './success/success.interceptor';
import { PicsurThrottlerGuard } from './throttler/PicsurThrottler.guard';
import { ZodValidationPipe } from './validate/zod-validator.pipe';

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
