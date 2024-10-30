import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Fail, FT } from 'picsur-shared/dist/types/failable';
import AuthFastifyRequest from '../models/interfaces/authrequest.dto.js';

export const ReqUser = createParamDecorator(
  (input: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as AuthFastifyRequest;
    return request.user;
  },
);

export const ReqUserID = createParamDecorator(
  (input: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as AuthFastifyRequest;
    const id = request.user.id;
    if (!id) throw Fail(FT.Internal, undefined, 'User ID is not set');
    return id;
  },
);
