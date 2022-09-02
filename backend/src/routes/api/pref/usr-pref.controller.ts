import {
  Body,
  Controller,
  Get, Logger,
  Param,
  Post
} from '@nestjs/common';
import {
  GetPreferenceResponse,
  MultiplePreferencesResponse,
  UpdatePreferenceRequest,
  UpdatePreferenceResponse
} from 'picsur-shared/dist/dto/api/pref.dto';
import { ThrowIfFailed } from 'picsur-shared/dist/types';
import { UsrPreferenceDbService } from '../../../collections/preference-db/usr-preference-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/constants/permissions.const';

@Controller('api/pref/usr')
@RequiredPermissions(Permission.Settings)
export class UsrPrefController {
  private readonly logger = new Logger(UsrPrefController.name);

  constructor(private readonly prefService: UsrPreferenceDbService) {}

  @Get()
  @Returns(MultiplePreferencesResponse)
  async getAllSysPrefs(
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
  async getSysPref(
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
  async setSysPref(
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
