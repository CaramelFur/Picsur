import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import {
    GetPreferenceResponse,
    MultiplePreferencesResponse,
    UpdatePreferenceRequest,
    UpdatePreferenceResponse,
} from 'picsur-shared/dist/dto/api/pref.dto';
import { ThrowIfFailed } from 'picsur-shared/dist/types/failable';
import { SysPreferenceDbService } from '../../../collections/preference-db/sys-preference-db.service.js';
import { EasyThrottle } from '../../../decorators/easy-throttle.decorator.js';
import { RequiredPermissions } from '../../../decorators/permissions.decorator.js';
import { Returns } from '../../../decorators/returns.decorator.js';
import { Permission } from '../../../models/constants/permissions.const.js';

@Controller('api/pref/sys')
@RequiredPermissions(Permission.SysPrefAdmin)
export class SysPrefController {
  private readonly logger = new Logger(SysPrefController.name);

  constructor(private readonly prefService: SysPreferenceDbService) {}

  @Get()
  @Returns(MultiplePreferencesResponse)
  @EasyThrottle(20)
  async getAllSysPrefs(): Promise<MultiplePreferencesResponse> {
    const prefs = ThrowIfFailed(await this.prefService.getAllPreferences());

    return {
      results: prefs,
      total: prefs.length,
    };
  }

  @Get(':key')
  @Returns(GetPreferenceResponse)
  async getSysPref(@Param('key') key: string): Promise<GetPreferenceResponse> {
    const pref = ThrowIfFailed(await this.prefService.getPreference(key));

    return pref;
  }

  @Post(':key')
  @Returns(UpdatePreferenceResponse)
  @EasyThrottle(30)
  async setSysPref(
    @Param('key') key: string,
    @Body() body: UpdatePreferenceRequest,
  ): Promise<UpdatePreferenceResponse> {
    const value = body.value;

    const pref = ThrowIfFailed(
      await this.prefService.setPreference(key, value),
    );

    return {
      key,
      value: pref.value,
      type: pref.type,
    };
  }
}
