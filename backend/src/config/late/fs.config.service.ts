import { S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { ThrowIfFailed } from 'picsur-shared/dist/types';
import { SysPreferenceDbService } from '../../collections/preference-db/sys-preference-db.service';
import { GithubUrl } from '../config.static';
import { EarlyFSConfigService, FileStorageMode } from '../early/early-fs.config.service';

@Injectable()
export class FSConfigService {
  private readonly logger = new Logger(FSConfigService.name);

  constructor(
    private readonly earlyFsConfigService: EarlyFSConfigService,
    private readonly sysPrefService: SysPreferenceDbService,
  ) {
    this.printDebug().catch(this.logger.error);
  }

  private async printDebug() {
    const mode = this.getFileStorageMode();

    if (mode === FileStorageMode.Local) {
      this.logger.log('File storage Mode: Local');

      this.logger.log('Local Path: ' + (await this.getLocalPath()));
    } else if (mode === FileStorageMode.S3) {
      this.logger.log('File storage Mode: S3');

      const [endpoint, region, bucket, accessKey, secretKey] =
        await Promise.all([
          this.getS3Endpoint(),
          this.getS3Region(),
          this.getS3Bucket(),
          this.getS3AccessKey(),
          this.getS3SecretKey(),
        ]);

      if (endpoint) this.logger.log('Custom S3 Endpoint: ' + endpoint);

      this.logger.log('S3 Region: ' + region);
      this.logger.log('S3 Bucket: ' + bucket);

      this.logger.verbose('S3 Access Key: ' + accessKey);
      this.logger.verbose('S3 Secret Key: ' + secretKey);
    } else {
      this.logger.error('File storage mode: None');
      this.logger.warn(
        `Please set the storage mode setting. Check ${GithubUrl} for more information.`,
      );
    }
  }

  public getFileStorageMode(): FileStorageMode {
    return this.earlyFsConfigService.getFileStorageMode();
  }

  public async getLocalPath(): Promise<string> {
    return ThrowIfFailed(
      await this.sysPrefService.getStringPreference(SysPreference.FSLocalPath),
    );
  }

  public async getS3Config(): Promise<S3ClientConfig> {
    return {
      credentials: {
        accessKeyId: await this.getS3AccessKey(),
        secretAccessKey: await this.getS3SecretKey(),
      },
      endpoint: (await this.getS3Endpoint()) ?? undefined,
      region: await this.getS3Region(),
      tls: await this.getS3TLS(),
    };
  }

  public async getS3Endpoint(): Promise<string | null> {
    return ThrowIfFailed(
      await this.sysPrefService.getStringPreference(SysPreference.FSS3Endpoint),
    );
  }

  public async getS3TLS(): Promise<boolean | undefined> {
    const endpoint = await this.getS3Endpoint();
    if (endpoint) {
      return endpoint.startsWith('https');
    }
    return undefined;
  }

  public async getS3Bucket(): Promise<string> {
    return ThrowIfFailed(
      await this.sysPrefService.getStringPreference(SysPreference.FSS3Bucket),
    );
  }

  public async getS3Region(): Promise<string> {
    return ThrowIfFailed(
      await this.sysPrefService.getStringPreference(SysPreference.FSS3Region),
    );
  }

  public async getS3AccessKey(): Promise<string> {
    return ThrowIfFailed(
      await this.sysPrefService.getStringPreference(
        SysPreference.FSS3AccessKey,
      ),
    );
  }

  public async getS3SecretKey(): Promise<string> {
    return ThrowIfFailed(
      await this.sysPrefService.getStringPreference(
        SysPreference.FSS3SecretKey,
      ),
    );
  }
}
