import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  GetPreferenceResponse,
  MultiplePreferencesResponse,
  UpdatePreferenceRequest,
  UpdatePreferenceResponse,
} from 'picsur-shared/dist/dto/api/pref.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsrPreferenceService } from '../../../collections/preference-db/usr-preference-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/constants/permissions.const';

@Controller('api/pref/usr')
@RequiredPermissions(Permission.Settings)
export class UsrPrefController {
  private readonly logger = new Logger('UsrPrefController');

  constructor(private prefService: UsrPreferenceService) {}

  @Get()
  @Returns(MultiplePreferencesResponse)
  async getAllSysPrefs(
    @ReqUserID() userid: string,
  ): Promise<MultiplePreferencesResponse> {
    const prefs = await this.prefService.getAllPreferences(userid);
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
    @ReqUserID() userid: string,
  ): Promise<GetPreferenceResponse> {
    const pref = await this.prefService.getPreference(userid, key);
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
    @ReqUserID() userid: string,
    @Body() body: UpdatePreferenceRequest,
  ): Promise<UpdatePreferenceResponse> {
    const value = body.value;

    const pref = await this.prefService.setPreference(userid, key, value);
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
