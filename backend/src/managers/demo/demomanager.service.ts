import { Injectable, Logger } from '@nestjs/common';
import { ImageDBService } from '../../collections/imagedb/imagedb.service';

@Injectable()
export class DemoManagerService {
  private readonly logger = new Logger('DemoManagerService');

  constructor(private readonly imagesService: ImageDBService) {}

  private async executeAsync() {
    this.logger.log('Executing demo cleanup');
    await this.imagesService.deleteAll();
  }

  public execute() {
    this.executeAsync().catch(this.logger.error);
  }
}
