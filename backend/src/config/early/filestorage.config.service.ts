import { S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix, GithubUrl } from '../config.static';

export enum FileStorageMode {
  None = 'none',
  Local = 'local',
  S3 = 's3',
}

const FSEnvPrefix = `${EnvPrefix}FILESTORAGE_`;

@Injectable()
export class FileStorageConfigService {
  private readonly logger = new Logger(FileStorageConfigService.name);

  constructor(private readonly configService: ConfigService) {
    const mode = this.getFileStorageMode();
    if (mode === FileStorageMode.Local) {
      this.logger.log('File storage Mode: Local');

      this.logger.log('Local Path: ' + this.getLocalPath());
    } else if (mode === FileStorageMode.S3) {
      this.logger.log('File storage Mode: S3');

      if (this.getS3Endpoint())
        this.logger.log('Custom S3 Endpoint: ' + this.getS3Endpoint());

      this.logger.log('S3 Region: ' + this.getS3Region());
      this.logger.log('S3 Bucket: ' + this.getS3Bucket());

      this.logger.verbose('S3 Access Key: ' + this.getS3AccessKey());
      this.logger.verbose('S3 Secret Key: ' + this.getS3SecretKey());
    } else {
      this.logger.error('File storage mode: None');
      this.logger.warn(
        `Please set the storage mode setting. Check ${GithubUrl} for more information.`,
      );
    }
  }

  public getFileStorageMode(): FileStorageMode {
    const parsed = ParseString(
      this.configService.get(`${FSEnvPrefix}MODE`),
      FileStorageMode.None,
    ).toLowerCase();
    if (parsed === FileStorageMode.Local || parsed === FileStorageMode.S3) {
      return parsed;
    }
    return FileStorageMode.None;
  }

  public getLocalPath(): string {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}LOCAL_PATH`),
      '/data',
    );
  }

  public getS3Config(): S3ClientConfig {
    return {
      credentials: {
        accessKeyId: this.getS3AccessKey(),
        secretAccessKey: this.getS3SecretKey(),
      },
      endpoint: this.getS3Endpoint() ?? undefined,
      region: this.getS3Region(),
      tls: this.getS3TLS(),
    };
  }

  public getS3Endpoint(): string | null {
    return ParseString(
      this.configService.get(`${FSEnvPrefix}S3_ENDPOINT`),
      null,
    );
  }

  public getS3TLS(): boolean | undefined {
    const endpoint = this.getS3Endpoint();
    if (endpoint) {
      return endpoint.startsWith('https');
    }
    return undefined;
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
