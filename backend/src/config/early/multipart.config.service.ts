import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvPrefix } from '../config.static';

@Injectable()
export class MultipartConfigService {
  private readonly logger = new Logger('MultipartConfigService');

  constructor(private configService: ConfigService) {
    this.logger.log('Max file size: ' + this.getMaxFileSize());
  }

  public getMaxFileSize(): number {
    return this.configService.get<number>(
      `${EnvPrefix}MAX_FILE_SIZE`,
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
