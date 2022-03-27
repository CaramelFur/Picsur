import { Controller, Get } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AllPermissionsResponse, InfoResponse } from 'picsur-shared/dist/dto/api/info.dto';
import { HostConfigService } from '../../../config/host.config.service';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { PermissionsList } from '../../../models/dto/permissions.dto';

@Controller('api/info')
@NoPermissions()
export class InfoController {
  constructor(private hostConfig: HostConfigService) {}

  @Get()
  async getInfo(): Promise<InfoResponse> {
    return {
      demo: this.hostConfig.isDemo(),
      production: this.hostConfig.isProduction(),
      version: this.hostConfig.getVersion(),
    };
  }

  // List all available permissions
  @Get('/permissions')
  async getPermissions(): Promise<AllPermissionsResponse> {
    const result: AllPermissionsResponse = {
      Permissions: PermissionsList,
    };

    return plainToClass(AllPermissionsResponse, result);
  }
}
