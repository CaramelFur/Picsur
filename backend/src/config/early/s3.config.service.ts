import { S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static.js';

@Injectable()
export class S3ConfigService {
  private readonly logger = new Logger(S3ConfigService.name);

  constructor(private readonly configService: ConfigService) {
    if (this.getS3Endpoint())
      this.logger.log('Custom S3 Endpoint: ' + this.getS3Endpoint());

    this.logger.log('S3 Region: ' + this.getS3Region());
    this.logger.log('S3 Bucket: ' + this.getS3Bucket());

    this.logger.verbose('S3 Access Key: ' + this.getS3AccessKey());
    this.logger.verbose('S3 Secret Key: ' + this.getS3SecretKey());
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
    return ParseString(this.configService.get(`${EnvPrefix}S3_ENDPOINT`), null);
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
      this.configService.get(`${EnvPrefix}S3_BUCKET`),
      'picsur',
    );
  }

  public getS3Region(): string {
    return ParseString(
      this.configService.get(`${EnvPrefix}S3_REGION`),
      'us-east-1',
    );
  }

  public getS3AccessKey(): string {
    return ParseString(
      this.configService.get(`${EnvPrefix}S3_ACCESS_KEY`),
      'picsur',
    );
  }

  public getS3SecretKey(): string {
    return ParseString(
      this.configService.get(`${EnvPrefix}S3_SECRET_KEY`),
      'picsur',
    );
  }
}
