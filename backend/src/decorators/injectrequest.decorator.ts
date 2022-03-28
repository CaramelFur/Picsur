import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Newable } from 'picsur-shared/dist/types';

// Since pipes dont have direct access to the request object, we need this decorator to inject it
export const InjectRequest = createParamDecorator(
  async <T extends Object>(data: Newable<T>, ctx: ExecutionContext) => {
    return {
      req: ctx.switchToHttp().getRequest(),
      data,
    };
  },
);
