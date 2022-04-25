import { Controller, Get } from '@nestjs/common';
import {
  AllFormatsResponse,
  AllPermissionsResponse,
  InfoResponse
} from 'picsur-shared/dist/dto/api/info.dto';
import {
  AnimMime2ExtMap,
  ImageMime2ExtMap
} from 'picsur-shared/dist/dto/mimes.dto';
import { HostConfigService } from '../../../config/early/host.config.service';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { PermissionsList } from '../../../models/constants/permissions.const';

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

  // List all supported image formats
  @Get('formats')
  @Returns(AllFormatsResponse)
  async getFormats(): Promise<AllFormatsResponse> {
    return {
      image: ImageMime2ExtMap,
      anim: AnimMime2ExtMap,
    };
  }
}
