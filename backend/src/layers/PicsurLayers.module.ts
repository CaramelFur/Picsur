import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { MainExceptionFilter } from './exception/exception.filter';
import { SuccessInterceptor } from './success/success.interceptor';
import { PicsurThrottlerGuard } from './throttler/PicsurThrottler.guard';
import { ZodValidationPipe } from './validate/zod-validator.pipe';

@Module({
  imports: [ThrottlerModule.forRoot({
    ttl: 60,
    limit: 60,
  })],
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
