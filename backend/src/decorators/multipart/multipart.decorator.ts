import { InjectRequest } from './inject-request.decorator.js';
import { PostFilePipe } from './postfile.pipe.js';
import { MultiPartPipe } from './postfiles.pipe.js';

export const PostFile = () => InjectRequest(PostFilePipe);

export const PostFiles = (maxFiles?: number) =>
  InjectRequest(maxFiles, MultiPartPipe);
