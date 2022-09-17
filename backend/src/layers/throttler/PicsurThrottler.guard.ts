import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Fail, FT } from 'picsur-shared/dist/types';

@Injectable()
export class PicsurThrottlerGuard extends ThrottlerGuard {
  protected override throwThrottlingException(context: ExecutionContext): void {
    throw Fail(FT.RateLimit);
  }
}
