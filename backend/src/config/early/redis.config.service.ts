import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseString } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static.js';

@Injectable()
export class RedisConfigService {
  private readonly logger = new Logger(RedisConfigService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Redis URL: ' + this.getRedisUrl());
  }

  public getRedisUrl(): string {
    return ParseString(
      this.configService.get(`${EnvPrefix}REDIS_URL`),
      'redis://localhost:6379',
    );
  }
}
