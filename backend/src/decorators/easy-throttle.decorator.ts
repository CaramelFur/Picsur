import { Throttle } from '@nestjs/throttler';

export const EasyThrottle = (
  limit: number,
  ttl?: number,
): MethodDecorator & ClassDecorator =>
  Throttle({
    default: {
      limit,
      ttl: ttl ?? 60,
    },
  });
