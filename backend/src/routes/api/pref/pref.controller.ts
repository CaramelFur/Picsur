import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post
} from '@nestjs/common';
import {
  SysPreferenceResponse,
  UpdateSysPreferenceRequest
} from 'picsur-shared/dist/dto/api/pref.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { SysPreferences } from 'picsur-shared/dist/dto/syspreferences.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../../../collections/syspreferencesdb/syspreferencedb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';

@Controller('api/pref')
@RequiredPermissions(Permission.SysPrefManage)
export class PrefController {
  private readonly logger = new Logger('PrefController');

  constructor(private prefService: SysPreferenceService) {}

  @Get('sys/:key')
  async getSysPref(@Param('key') key: string): Promise<SysPreferenceResponse> {
    const pref = await this.prefService.getPreference(key as SysPreferences);
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not get preference');
    }

    const returned = new SysPreferenceResponse();
    returned.key = key as SysPreferences;
    returned.value = pref.value;
    returned.type = pref.type;

    return returned;
  }

  @Post('sys/:key')
  async setSysPref(
    @Param('key') key: string,
    @Body() body: UpdateSysPreferenceRequest,
  ): Promise<SysPreferenceResponse> {
    const value = body.value;
    
    const pref = await this.prefService.setPreference(
      key as SysPreferences,
      value,
    );
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not set preference');
    }

    const returned = new SysPreferenceResponse();
    returned.key = key as SysPreferences;
    returned.value = pref.value;
    returned.type = pref.type;

    return returned;
  }
}
