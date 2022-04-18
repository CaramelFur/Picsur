import { Injectable, Logger } from '@nestjs/common';
import { ImageDBService } from '../../collections/image-db/image-db.service';
import { RolesService } from '../../collections/role-db/role-db.service';
import { Permission } from '../../models/constants/permissions.const';

@Injectable()
export class DemoManagerService {
  private readonly logger = new Logger('DemoManagerService');

  constructor(
    private readonly imagesService: ImageDBService,
    private rolesService: RolesService,
  ) {}

  public async setupRoles() {
    this.logger.warn(
      'Modifying roles for demo mode, this will not be reverted automatically',
    );
    // Could be done manually, but this makes settup up a demo instance quicker
    this.rolesService.addPermissions('guest', [Permission.ImageUpload]);
  }

  public execute() {
    this.executeAsync().catch(this.logger.error);
  }

  private async executeAsync() {
    this.logger.debug('Executing demo cleanup');
    await this.imagesService.deleteAll(true);
  }
}
