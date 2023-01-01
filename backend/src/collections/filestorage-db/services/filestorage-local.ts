import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import afs from 'fs/promises';
import pathlib from 'path';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { FSConfigService } from '../../../config/late/fs.config.service';
import { FileStorageService } from './filestorage-service';

export class FileStorageLocalService extends FileStorageService {
  private readonly logger = new Logger(FileStorageLocalService.name);

  private path = './temp';

  constructor(config: FSConfigService) {
    super(config);
  }

  async onStorageInit() {
    this.path = await this.config.getLocalPath();
    await this.ensureFileDir(this.path);
  }

  public async putFile(key: string, data: Buffer): AsyncFailable<string> {
    const path = this.getKeyFilePath(key);
    const result = await this.ensureFileDir(path);
    if (HasFailed(result)) return result;

    try {
      await afs.writeFile(path, data);
      return key;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  public async getFile(key: string): AsyncFailable<Buffer> {
    const path = this.getKeyFilePath(key);
    try {
      const result = await afs.readFile(path);
      return result;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  public async deleteFile(key: string): AsyncFailable<true> {
    const path = this.getKeyFilePath(key);
    try {
      await afs.unlink(path);
      return true;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  public async deleteFiles(keys: string[]): AsyncFailable<true> {
    const paths = keys.map((key) => this.getKeyFilePath(key));
    try {
      await Promise.all(paths.map((path) => afs.unlink(path)));
      return true;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  private getKeyFilePath(key: string): string {
    const subfolder = key.slice(0, 4);
    return pathlib.resolve(this.path, subfolder, key);
  }

  private async ensureFileDir(path: string): AsyncFailable<true> {
    try {
      const dir = path.split('/').slice(0, -1).join('/');
      if (!fs.existsSync(dir)) {
        await afs.mkdir(dir, {
          recursive: true,
        });
      }
      return true;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }
}
