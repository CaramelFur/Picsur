import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { getStreamAsBuffer } from 'get-stream';

import { AsyncFailable, Fail, FT } from 'picsur-shared/types/failable';
import { Readable } from 'stream';
import { S3ConfigService } from '../../config/early/s3.config.service.js';

@Injectable()
export class FileS3Service implements OnModuleInit {
  private readonly logger = new Logger(FileS3Service.name);

  private S3: Promise<S3Client> = this.loadS3();

  constructor(private readonly s3config: S3ConfigService) {}

  onModuleInit() {
    this.loadS3();
  }

  private async loadS3(): Promise<S3Client> {
    const S3 = new S3Client(this.s3config.getS3Config());

    try {
      // Create bucket if it doesn't exist
      const bucket = this.s3config.getS3Bucket();

      // List buckets
      const listBuckets = await S3.send(new ListBucketsCommand({}));

      const bucketExists = listBuckets.Buckets?.some((b) => b.Name === bucket);
      if (!bucketExists) {
        this.logger.verbose(`Creating S3 Bucket ${bucket}`);
        await S3.send(new CreateBucketCommand({ Bucket: bucket }));
      } else {
        this.logger.verbose(`Using existing S3 Bucket ${bucket}`);
      }
    } catch (e) {
      this.logger.error(e);
    }
    return S3;
  }

  public async putFile(key: string, data: Buffer): AsyncFailable<string> {
    const S3 = await this.S3;

    const request = new PutObjectCommand({
      Bucket: this.s3config.getS3Bucket(),
      Key: key,
      Body: data,
    });

    try {
      await S3.send(request);
      return key;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async getFile(key: string): AsyncFailable<Buffer> {
    const S3 = await this.S3;

    const request = new GetObjectCommand({
      Bucket: this.s3config.getS3Bucket(),
      Key: key,
    });

    try {
      const result = await S3.send(request);
      if (!result.Body) return Fail(FT.NotFound, 'File not found');

      if (result.Body instanceof Blob) {
        return Buffer.from(await result.Body.arrayBuffer());
      }
      return await getStreamAsBuffer(result.Body as Readable);
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async deleteFile(key: string): AsyncFailable<true> {
    const S3 = await this.S3;

    const request = new DeleteObjectCommand({
      Bucket: this.s3config.getS3Bucket(),
      Key: key,
    });

    try {
      await S3.send(request);
      return true;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async deleteFiles(keys: string[]): AsyncFailable<true> {
    const S3 = await this.S3;

    const request = new DeleteObjectsCommand({
      Bucket: this.s3config.getS3Bucket(),
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    try {
      await S3.send(request);
      return true;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }
}
