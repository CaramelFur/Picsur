import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post
} from '@nestjs/common';
import {
  SysPreferences,
  UpdateSysPreferenceRequest
} from 'picsur-shared/dist/dto/syspreferences.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../../../collections/syspreferencesdb/syspreferencedb.service';
import { Authenticated } from '../../../decorators/authenticated';

@Controller('api/pref')
@Authenticated(true)
export class PrefController {
  constructor(private prefService: SysPreferenceService) {}

  @Get('sys/:key')
  async getSysPref(@Param('key') key: string) {
    const returned = await this.prefService.getPreference(
      key as SysPreferences,
    );
    if (HasFailed(returned)) {
      console.warn(returned.getReason());
      throw new InternalServerErrorException('Could not get preference');
    }

    return returned;
  }

  @Post('sys/:key')
  async setSysPref(
    @Param('key') key: string,
    @Body() body: UpdateSysPreferenceRequest,
  ) {
    const value = body.value;
    const returned = await this.prefService.setPreference(
      key as SysPreferences,
      value,
    );
    if (HasFailed(returned)) {
      console.warn(returned.getReason());
      throw new InternalServerErrorException('Could not set preference');
    }

    return returned;
  }
}
