import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { RedisConfigService } from './redis.config.service';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly redisConfig: RedisConfigService) {}

  async createSharedConfiguration(): Promise<BullRootModuleOptions> {
    const options: BullRootModuleOptions = {
      url: this.redisConfig.getRedisUrl(),
      redis: {
        lazyConnect: false,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnFail: true,
      },
    };
    return options;
  }
}
