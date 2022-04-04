import { InjectRequest } from './injectrequest.decorator';
import { MultiPartPipe } from './multipart.pipe';
import { PostFilePipe } from './postfile.pipe';

export const PostFile = () => InjectRequest(PostFilePipe);

export const MultiPart = () =>
  InjectRequest(MultiPartPipe);
