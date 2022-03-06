import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Newable } from 'picsur-shared/dist/types';
import { MultiPartPipe } from './multipart.pipe';
import { PostFilePipe } from './postfile.pipe';

const InjectRequest = createParamDecorator(
  async <T extends Object>(data: Newable<T>, ctx: ExecutionContext) => {
    return {
      req: ctx.switchToHttp().getRequest(),
      data,
    };
  },
);

export const PostFile = () => 
  InjectRequest(PostFilePipe);

export const MultiPart = <T extends Object>(data: Newable<T>) =>
  InjectRequest(data, MultiPartPipe);
