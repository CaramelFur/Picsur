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
  GetPreferenceResponse,
  MultiplePreferencesResponse,
  UpdatePreferenceRequest,
  UpdatePreferenceResponse
} from 'picsur-shared/dist/dto/api/pref.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../../../collections/preference-db/sys-preference-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/constants/permissions.const';

@Controller('api/pref/sys')
@RequiredPermissions(Permission.SysPrefManage)
export class SysPrefController {
  private readonly logger = new Logger('SysPrefController');

  constructor(private prefService: SysPreferenceService) {}

  @Get()
  @Returns(MultiplePreferencesResponse)
  async getAllSysPrefs(): Promise<MultiplePreferencesResponse> {
    const prefs = await this.prefService.getAllPreferences();
    if (HasFailed(prefs)) {
      this.logger.warn(prefs.getReason());
      throw new InternalServerErrorException('Could not get preferences');
    }

    return {
      preferences: prefs,
      total: prefs.length,
    };
  }

  @Get(':key')
  @Returns(GetPreferenceResponse)
  async getSysPref(
    @Param('key') key: string,
  ): Promise<GetPreferenceResponse> {
    const pref = await this.prefService.getPreference(key);
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not get preference');
    }

    return pref;
  }

  @Post(':key')
  @Returns(UpdatePreferenceResponse)
  async setSysPref(
    @Param('key') key: string,
    @Body() body: UpdatePreferenceRequest,
  ): Promise<UpdatePreferenceResponse> {
    const value = body.value;

    const pref = await this.prefService.setPreference(key, value);
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not set preference');
    }

    return {
      key,
      value: pref.value,
      type: pref.type,
    };
  }
}
