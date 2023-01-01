import { AsyncFailable } from 'picsur-shared/dist/types';
import { FSConfigService } from '../../../config/late/fs.config.service';

export abstract class FileStorageService {
  constructor(protected readonly config: FSConfigService) {}

  public abstract onStorageInit(): Promise<void> | void;
  public abstract putFile(key: string, data: Buffer): AsyncFailable<string>;
  public abstract getFile(key: string): AsyncFailable<Buffer>;
  public abstract deleteFile(key: string): AsyncFailable<true>;
  public abstract deleteFiles(keys: string[]): AsyncFailable<true>;
}
