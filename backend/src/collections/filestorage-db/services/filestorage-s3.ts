import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import { buffer as streamToBuffer } from 'get-stream';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { Readable } from 'stream';
import { FileStorageService } from './filestorage-service';

export class FileStorageS3Service extends FileStorageService {
  private readonly logger = new Logger(FileStorageS3Service.name);
  private S3: S3Client | null = null;

  onStorageInit() {
    this.loadS3();
  }

  public async putFile(key: string, data: Buffer): AsyncFailable<string> {
    const S3 = await this.getS3();
    if (HasFailed(S3)) return S3;

    const request = new PutObjectCommand({
      Bucket: await this.config.getS3Bucket(),
      Key: key,
      Body: data,
    });

    try {
      await S3.send(request);
      return key;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  public async getFile(key: string): AsyncFailable<Buffer> {
    const S3 = await this.getS3();
    if (HasFailed(S3)) return S3;

    const request = new GetObjectCommand({
      Bucket: await this.config.getS3Bucket(),
      Key: key,
    });

    try {
      const result = await S3.send(request);
      if (!result.Body) return Fail(FT.NotFound, 'File not found');

      if (result.Body instanceof Blob) {
        return Buffer.from(await result.Body.arrayBuffer());
      }
      return streamToBuffer(result.Body as Readable);
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  public async deleteFile(key: string): AsyncFailable<true> {
    const S3 = await this.getS3();
    if (HasFailed(S3)) return S3;

    const request = new DeleteObjectCommand({
      Bucket: await this.config.getS3Bucket(),
      Key: key,
    });

    try {
      await S3.send(request);
      return true;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  public async deleteFiles(keys: string[]): AsyncFailable<true> {
    const S3 = await this.getS3();
    if (HasFailed(S3)) return S3;

    const request = new DeleteObjectsCommand({
      Bucket: await this.config.getS3Bucket(),
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
      },
    });

    try {
      await S3.send(request);
      return true;
    } catch (e) {
      return Fail(FT.FileStorage, e);
    }
  }

  private async getS3(): AsyncFailable<S3Client> {
    if (this.S3) return this.S3;
    await this.loadS3();
    if (this.S3) return this.S3;
    return Fail(FT.FileStorage, 'S3 not loaded');
  }

  private async loadS3(): Promise<void> {
    const S3 = new S3Client(await this.config.getS3Config());

    try {
      // Create bucket if it doesn't exist
      const bucket = await this.config.getS3Bucket();

      // List buckets
      const listBuckets = await S3.send(new ListBucketsCommand({}));

      const bucketExists = listBuckets.Buckets?.some((b) => b.Name === bucket);
      if (!bucketExists) {
        this.logger.verbose(`Creating S3 Bucket ${bucket}`);
        await S3.send(new CreateBucketCommand({ Bucket: bucket }));
      } else {
        this.logger.verbose(`Using existing S3 Bucket ${bucket}`);
      }

      this.S3 = S3;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
