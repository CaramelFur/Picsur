import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Since pipes dont have direct access to the request object, we need this decorator to inject it
export const InjectRequest = createParamDecorator(
  async (data: any, ctx: ExecutionContext) => {
    return {
      data: data,
      request: ctx.switchToHttp().getRequest(),
    };
  },
);
