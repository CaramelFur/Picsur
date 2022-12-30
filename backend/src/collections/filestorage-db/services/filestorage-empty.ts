import { AsyncFailable, Fail, FT } from 'picsur-shared/dist/types';
import { FileStorageService } from './filestorage-service';

export class FileStorageEmpty extends FileStorageService {
  private readonly errorMessage = 'No file storage configured';

  constructor() {
    super(undefined as any);
  }

  onStorageInit(): void {}

  async putFile(key: string, data: Buffer): AsyncFailable<string> {
    return Fail(FT.Internal, this.errorMessage);
  }
  async getFile(key: string): AsyncFailable<Buffer> {
    return Fail(FT.Internal, this.errorMessage);
  }
  async deleteFile(key: string): AsyncFailable<true> {
    return Fail(FT.Internal, this.errorMessage);
  }
  async deleteFiles(keys: string[]): AsyncFailable<true> {
    return Fail(FT.Internal, this.errorMessage);
  }
}
