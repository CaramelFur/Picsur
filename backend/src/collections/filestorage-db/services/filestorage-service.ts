import { AsyncFailable } from 'picsur-shared/dist/types';
import { FileStorageConfigService } from '../../../config/early/filestorage.config.service';

export abstract class FileStorageService {
  constructor(protected readonly config: FileStorageConfigService) {}

  public abstract onStorageInit(): Promise<void> | void;
  public abstract putFile(key: string, data: Buffer): AsyncFailable<string>;
  public abstract getFile(key: string): AsyncFailable<Buffer>;
  public abstract deleteFile(key: string): AsyncFailable<true>;
  public abstract deleteFiles(keys: string[]): AsyncFailable<true>;
}
