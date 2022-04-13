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
  GetSysPreferenceResponse,
  MultipleSysPreferencesResponse,
  UpdateSysPreferenceRequest,
  UpdateSysPreferenceResponse
} from 'picsur-shared/dist/dto/api/syspref.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsrPreferenceService } from '../../../collections/preferencesdb/usrpreferencedb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/dto/permissions.dto';

@Controller('api/pref/usr')
@RequiredPermissions(Permission.Settings)
export class UsrPrefController {
  private readonly logger = new Logger('UsrPrefController');

  constructor(private prefService: UsrPreferenceService) {}

  @Get()
  @Returns(MultipleSysPreferencesResponse)
  async getAllSysPrefs(@ReqUserID() userid: string): Promise<MultipleSysPreferencesResponse> {
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
  @Returns(GetSysPreferenceResponse)
  async getSysPref(
    @Param('key') key: string,
    @ReqUserID() userid: string
  ): Promise<GetSysPreferenceResponse> {
    const pref = await this.prefService.getPreference(userid, key);
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not get preference');
    }

    return pref;
  }

  @Post(':key')
  @Returns(UpdateSysPreferenceResponse)
  async setSysPref(
    @Param('key') key: string,
    @ReqUserID() userid: string,
    @Body() body: UpdateSysPreferenceRequest,
  ): Promise<UpdateSysPreferenceResponse> {
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
