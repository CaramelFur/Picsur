import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import {
    GetPreferenceResponse,
    MultiplePreferencesResponse,
    UpdatePreferenceRequest,
    UpdatePreferenceResponse,
} from 'picsur-shared/dist/dto/api/pref.dto';
import { ThrowIfFailed } from 'picsur-shared/dist/types/failable';
import { UsrPreferenceDbService } from '../../../collections/preference-db/usr-preference-db.service.js';
import { EasyThrottle } from '../../../decorators/easy-throttle.decorator.js';
import { RequiredPermissions } from '../../../decorators/permissions.decorator.js';
import { ReqUserID } from '../../../decorators/request-user.decorator.js';
import { Returns } from '../../../decorators/returns.decorator.js';
import { Permission } from '../../../models/constants/permissions.const.js';

@Controller('api/pref/usr')
@RequiredPermissions(Permission.Settings)
export class UsrPrefController {
  private readonly logger = new Logger(UsrPrefController.name);

  constructor(private readonly prefService: UsrPreferenceDbService) {}

  @Get()
  @Returns(MultiplePreferencesResponse)
  @EasyThrottle(20)
  async getAllUsrPrefs(
    @ReqUserID() userid: string,
  ): Promise<MultiplePreferencesResponse> {
    const prefs = ThrowIfFailed(
      await this.prefService.getAllPreferences(userid),
    );

    return {
      results: prefs,
      total: prefs.length,
    };
  }

  @Get(':key')
  @Returns(GetPreferenceResponse)
  async getUsrPref(
    @Param('key') key: string,
    @ReqUserID() userid: string,
  ): Promise<GetPreferenceResponse> {
    const pref = ThrowIfFailed(
      await this.prefService.getPreference(userid, key),
    );

    return pref;
  }

  @Post(':key')
  @Returns(UpdatePreferenceResponse)
  @EasyThrottle(30)
  async setUsrPref(
    @Param('key') key: string,
    @ReqUserID() userid: string,
    @Body() body: UpdatePreferenceRequest,
  ): Promise<UpdatePreferenceResponse> {
    const value = body.value;

    const pref = ThrowIfFailed(
      await this.prefService.setPreference(userid, key, value),
    );

    return {
      key,
      value: pref.value,
      type: pref.type,
    };
  }
}
