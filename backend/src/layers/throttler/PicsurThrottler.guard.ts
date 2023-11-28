import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FT, Fail } from 'picsur-shared/dist/types/failable';

@Injectable()
export class PicsurThrottlerGuard extends ThrottlerGuard {
  protected override throwThrottlingException(): Promise<void> {
    throw Fail(FT.RateLimit);
  }
}
