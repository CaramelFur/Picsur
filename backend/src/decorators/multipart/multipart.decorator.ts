import { InjectRequest } from './inject-request.decorator';
import { PostFilePipe } from './postfile.pipe';
import { MultiPartPipe } from './postfiles.pipe';

export const PostFile = () => InjectRequest(PostFilePipe);

export const PostFiles = (maxFiles?: number) =>
  InjectRequest(maxFiles, MultiPartPipe);
