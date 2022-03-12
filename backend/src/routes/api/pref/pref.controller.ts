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
  SysPreferences,
  UpdateSysPreferenceRequest
} from 'picsur-shared/dist/dto/syspreferences.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { SysPreferenceService } from '../../../collections/syspreferencesdb/syspreferencedb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';

@Controller('api/pref')
@RequiredPermissions('syspref-manage')
export class PrefController {
  private readonly logger = new Logger('PrefController');

  constructor(private prefService: SysPreferenceService) {}

  @Get('sys/:key')
  async getSysPref(@Param('key') key: string) {
    const returned = await this.prefService.getPreference(
      key as SysPreferences,
    );
    if (HasFailed(returned)) {
      this.logger.warn(returned.getReason());
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
      this.logger.warn(returned.getReason());
      throw new InternalServerErrorException('Could not set preference');
    }

    return returned;
  }
}
