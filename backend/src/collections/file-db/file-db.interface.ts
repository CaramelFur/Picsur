import { AsyncFailable } from 'picsur-shared/types/failable';
import { Readable } from 'stream';

export interface FileDB {
  putFile(key: string, data: Buffer | Readable): AsyncFailable<string>;
  getFileBlob(key: string): AsyncFailable<Buffer>;
  getFileStream(key: string): AsyncFailable<Readable>;
  deleteFile(key: string): AsyncFailable<true>;
  deleteFiles(keys: string[]): AsyncFailable<true>;
}
