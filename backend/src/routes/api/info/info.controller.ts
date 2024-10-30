import { Controller, Get } from '@nestjs/common';
import {
    AllFormatsResponse,
    AllPermissionsResponse,
    InfoResponse,
} from 'picsur-shared/dist/dto/api/info.dto';
import {
    FileType2Ext,
    FileType2Mime,
    SupportedAnimFileTypes,
    SupportedImageFileTypes,
} from 'picsur-shared/dist/dto/mimes.dto';
import { TrackingState } from 'picsur-shared/dist/dto/tracking-state.enum';
import { FallbackIfFailed } from 'picsur-shared/dist/types/failable';
import { HostConfigService } from '../../../config/early/host.config.service.js';
import { InfoConfigService } from '../../../config/late/info.config.service.js';
import { UsageConfigService } from '../../../config/late/usage.config.service.js';
import { NoPermissions } from '../../../decorators/permissions.decorator.js';
import { Returns } from '../../../decorators/returns.decorator.js';
import { PermissionsList } from '../../../models/constants/permissions.const.js';

@Controller('api/info')
@NoPermissions()
export class InfoController {
  constructor(
    private readonly hostConfig: HostConfigService,
    private readonly infoConfig: InfoConfigService,
    private readonly usageService: UsageConfigService,
  ) {}

  @Get()
  @Returns(InfoResponse)
  async getInfo(): Promise<InfoResponse> {
    const trackingID =
      FallbackIfFailed(await this.usageService.getTrackingID(), null) ??
      undefined;
    const hostOverride = await this.infoConfig.getHostnameOverride();

    return {
      demo: this.hostConfig.isDemo(),
      production: this.hostConfig.isProduction(),
      version: this.hostConfig.getVersion(),
      host_override: hostOverride,
      tracking: {
        id: trackingID,
        state: TrackingState.Detailed,
      },
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
      image: Object.fromEntries(
        SupportedImageFileTypes.map((filetype) => [
          FileType2Mime(filetype),
          FileType2Ext(filetype),
        ]),
      ),
      anim: Object.fromEntries(
        SupportedAnimFileTypes.map((filetype) => [
          FileType2Mime(filetype),
          FileType2Ext(filetype),
        ]),
      ),
    };
  }
}
