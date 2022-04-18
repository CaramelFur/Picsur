import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import AuthFasityRequest from '../models/interfaces/authrequest.dto';

export const ReqUser = createParamDecorator(
  (input: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as AuthFasityRequest;
    return request.user;
  },
);

export const ReqUserID = createParamDecorator(
  (input: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as AuthFasityRequest;
    const id = request.user.id;
    if (!id) throw new Error('User ID is not set');
    return id;
  },
);
