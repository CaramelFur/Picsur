import { Controller, Get } from '@nestjs/common';
import {
  AllPermissionsResponse,
  InfoResponse
} from 'picsur-shared/dist/dto/api/info.dto';
import { HostConfigService } from '../../../config/early/host.config.service';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { PermissionsList } from '../../../models/dto/permissions.dto';

@Controller('api/info')
@NoPermissions()
export class InfoController {
  constructor(private hostConfig: HostConfigService) {}

  @Get()
  @Returns(InfoResponse)
  async getInfo(): Promise<InfoResponse> {
    return {
      demo: this.hostConfig.isDemo(),
      production: this.hostConfig.isProduction(),
      version: this.hostConfig.getVersion(),
    };
  }

  // List all available permissions
  @Get('permissions')
  @Returns(AllPermissionsResponse)
  async getPermissions(): Promise<AllPermissionsResponse> {
    return {
      permissions: PermissionsList,
    };
  }
}
