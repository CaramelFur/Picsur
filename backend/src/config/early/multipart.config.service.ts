import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ParseInt } from 'picsur-shared/dist/util/parse-simple';
import { EnvPrefix } from '../config.static';

@Injectable()
export class MultipartConfigService {
  private readonly logger = new Logger(MultipartConfigService.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.log('Max file size: ' + this.getMaxFileSize());
  }

  public getMaxFileSize(): number {
    return ParseInt(
      this.configService.get(`${EnvPrefix}MAX_FILE_SIZE`),
      128000000,
    );
  }

  public getLimits() {
    return {
      fieldNameSize: 128,
      fieldSize: 1024,
      fields: 16,
      files: 16,
      fileSize: this.getMaxFileSize(),
    };
  }
}
