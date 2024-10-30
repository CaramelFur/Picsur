import { Injectable, Logger } from '@nestjs/common';
import isDocker from 'is-docker';
import fetch from 'node-fetch';
import * as os from 'os';
import { FallbackIfFailed, HasFailed } from 'picsur-shared/dist/types/failable';
import { UUIDRegex } from 'picsur-shared/dist/util/common-regex';
import { ImageDBService } from '../../collections/image-db/image-db.service.js';
import { SystemStateDbService } from '../../collections/system-state-db/system-state-db.service.js';
import { UserDbService } from '../../collections/user-db/user-db.service.js';
import { HostConfigService } from '../../config/early/host.config.service.js';
import { UsageConfigService } from '../../config/late/usage.config.service.js';

interface UsageData {
  id?: string;

  uptime: number;
  version: string;
  demo_active: boolean;

  users: number;
  images: number;

  architecture: string;
  cpu_count: number;
  ram_total: number;
  hostname: string;

  is_docker: boolean;
  is_production: boolean;
}

@Injectable()
export class UsageService {
  private readonly logger = new Logger(UsageService.name);

  constructor(
    private readonly systemState: SystemStateDbService,
    private readonly hostConfig: HostConfigService,
    private readonly usageConfig: UsageConfigService,
    private readonly userRepo: UserDbService,
    private readonly imageRepo: ImageDBService,
  ) {}

  public async execute() {
    if (!(await this.usageConfig.getMetricsEnabled())) return;

    const id = await this.getSystemID();

    if (id === null) {
      await this.sendInitialData();
    } else {
      await this.sendUpdateData(id);
    }
  }

  private async sendInitialData() {
    const url =
      (await this.usageConfig.getMetricsUrl()) + '/api/install/create';

    const result: any = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await this.collectData()),
    }).then((res) => res.json());

    const id = result?.data?.id;
    if (typeof id !== 'string')
      return this.logger.warn(
        'Invalid response when sending initial data: ' + JSON.stringify(result),
      );
    if (!UUIDRegex.test(id))
      return this.logger.warn('Invalid system ID: ' + id);

    await this.setSystemID(id);
  }

  private async sendUpdateData(id: string) {
    const url =
      (await this.usageConfig.getMetricsUrl()) + '/api/install/update';

    const body = await this.collectData();
    body.id = id;

    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (result.status < 200 || result.status >= 300) {
      const data: any = await result.json();

      if (data?.type === 'notfound') {
        this.logger.warn('System ID not found, clearing');
        await this.clearSystemID();
      } else {
        this.logger.warn(
          'Failed to send update data: ' + JSON.stringify(await result.json()),
        );
      }
    }
  }

  private async getSystemID(): Promise<string | null> {
    const result = await this.systemState.get('systemID');
    if (HasFailed(result)) {
      this.logger.warn(result);
      return null;
    }
    if (result === null) return null;
    if (UUIDRegex.test(result)) return result;
    this.logger.warn('Invalid system ID');
    return null;
  }

  private async setSystemID(id: string) {
    if (!UUIDRegex.test(id)) {
      return this.logger.warn('Invalid system ID');
    }
    const result = await this.systemState.set('systemID', id);
    if (HasFailed(result)) {
      this.logger.warn(result);
    }
  }

  private async clearSystemID() {
    const result = await this.systemState.clear('systemID');
    if (HasFailed(result)) {
      this.logger.warn(result);
    }
  }

  private async collectData(): Promise<UsageData> {
    const users = FallbackIfFailed(await this.userRepo.count(), 0, this.logger);
    const images = FallbackIfFailed(
      await this.imageRepo.count(),
      0,
      this.logger,
    );

    const data: UsageData = {
      uptime: Math.floor(process.uptime()),
      version: this.hostConfig.getVersion(),
      demo_active: this.hostConfig.isDemo(),
      users,
      images,
      architecture: process.arch,
      cpu_count: os.cpus().length,
      ram_total: Math.floor(os.totalmem() / 1024 / 1024),
      hostname: os.hostname(),
      is_docker: isDocker(),
      is_production: this.hostConfig.isProduction(),
    };
    return data;
  }
}
