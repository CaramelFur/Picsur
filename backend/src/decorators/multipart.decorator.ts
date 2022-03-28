import { Newable } from 'picsur-shared/dist/types';
import { InjectRequest } from './injectrequest.decorator';
import { MultiPartPipe } from './multipart.pipe';
import { PostFilePipe } from './postfile.pipe';

export const PostFile = () => InjectRequest(PostFilePipe);

export const MultiPart = <T extends Object>(data: Newable<T>) =>
  InjectRequest(data, MultiPartPipe);
