import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  GetSyspreferenceResponse,
  MultipleSysPreferencesResponse,
  SysPreferenceBaseResponse,
  UpdateSysPreferenceRequest,
  UpdateSysPreferenceResponse
} from 'picsur-shared/dist/dto/api/pref.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../../../collections/syspreferencesdb/syspreferencedb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Permission } from '../../../models/dto/permissions.dto';

@Controller('api/pref')
@RequiredPermissions(Permission.SysPrefManage)
export class PrefController {
  private readonly logger = new Logger('PrefController');

  constructor(private prefService: SysPreferenceService) {}

  @Get('sys')
  async getAllSysPrefs(): Promise<MultipleSysPreferencesResponse> {
    const prefs = await this.prefService.getAllPreferences();
    if (HasFailed(prefs)) {
      this.logger.warn(prefs.getReason());
      throw new InternalServerErrorException('Could not get preferences');
    }

    const returned: MultipleSysPreferencesResponse = {
      preferences: prefs.map((pref) =>
        plainToClass(SysPreferenceBaseResponse, pref),
      ),
      total: prefs.length,
    };

    return plainToClass(MultipleSysPreferencesResponse, returned);
  }

  @Get('sys/:key')
  async getSysPref(
    @Param('key') key: string,
  ): Promise<GetSyspreferenceResponse> {
    const pref = await this.prefService.getPreference(key);
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not get preference');
    }

    return plainToClass(GetSyspreferenceResponse, pref);
  }

  @Post('sys/:key')
  async setSysPref(
    @Param('key') key: string,
    @Body() body: UpdateSysPreferenceRequest,
  ): Promise<UpdateSysPreferenceResponse> {
    const value = body.value;

    const pref = await this.prefService.setPreference(key, value);
    if (HasFailed(pref)) {
      this.logger.warn(pref.getReason());
      throw new InternalServerErrorException('Could not set preference');
    }

    const returned = {
      key,
      value: pref.value,
      type: pref.type,
    };

    return plainToClass(UpdateSysPreferenceResponse, returned);
  }
}
