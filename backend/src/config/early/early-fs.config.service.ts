import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static';

export enum FileStorageMode {
  None = 'none',
  Local = 'local',
  S3 = 's3',
}

const FSEnvPrefix = `${EnvPrefix}FILESTORAGE_`;

@Injectable()
export class EarlyFSConfigService {
  constructor(private readonly configService: ConfigService) {}

  public getFileStorageMode(): FileStorageMode {
    const parsed = ParseString(
      this.configService.get(`${FSEnvPrefix}MODE`),
      FileStorageMode.None,
    ).toLowerCase();
    if (Object.values(FileStorageMode).includes(parsed as FileStorageMode)) {
      return parsed as FileStorageMode;
    }
    return FileStorageMode.None;
  }

  public getLocalPath(): string {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}LOCAL_PATH`),
      '/data',
    );
  }

  public getS3Endpoint(): string | null {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}S3_ENDPOINT`),
      null,
    );
  }

  public getS3Bucket(): string {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}S3_BUCKET`),
      'picsur',
    );
  }

  public getS3Region(): string {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}S3_REGION`),
      'us-east-1',
    );
  }

  public getS3AccessKey(): string {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}S3_ACCESS_KEY`),
      'picsur',
    );
  }

  public getS3SecretKey(): string {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}S3_SECRET_KEY`),
      'picsur',
    );
  }
}
