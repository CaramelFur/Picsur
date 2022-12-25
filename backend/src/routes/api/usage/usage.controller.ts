import {
  Body,
  Controller,
  Logger,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { ReturnsAnything } from '../../../decorators/returns.decorator';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type AuthFastifyRequest from '../../../models/interfaces/authrequest.dto';
import { SysPrefController } from '../pref/sys-pref.controller';
import { SysPreferenceDbService } from '../../../collections/preference-db/sys-preference-db.service';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { Fail, FT, ThrowIfFailed } from 'picsur-shared/dist/types';
import { URLRegex } from 'picsur-shared/dist/util/common-regex';
import { UsageService } from '../../../managers/usage/usage.service';

@Controller('api/usage')
@NoPermissions()
export class UsageController {
  private readonly logger = new Logger(UsageController.name);

  constructor(private readonly usageService: UsageService) {}

  @Post(['report', 'report/*'])
  @ReturnsAnything()
  async deleteRole(
    @Res({
      passthrough: true,
    })
    res: FastifyReply,
  ) {
    const trackingUrl = ThrowIfFailed(await this.usageService.getTrackingUrl());

    if (trackingUrl === null) {
      throw Fail(FT.NotFound, undefined, 'Tracking URL not set');
    }

    await res.from(`${trackingUrl}/api`);
  }
}
