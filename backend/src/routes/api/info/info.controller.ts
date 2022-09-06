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
import { HostConfigService } from '../../../config/early/host.config.service';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { PermissionsList } from '../../../models/constants/permissions.const';

@Controller('api/info')
@NoPermissions()
export class InfoController {
  constructor(private readonly hostConfig: HostConfigService) {}

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
