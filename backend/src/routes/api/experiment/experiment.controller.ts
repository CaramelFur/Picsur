import { Controller, Get, Request } from '@nestjs/common';
import { UserInfoResponse } from 'picsur-shared/dist/dto/api/user-manage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { ApiKeyDbService } from '../../../collections/apikey-db/apikey-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import type AuthFasityRequest from '../../../models/interfaces/authrequest.dto';

@Controller('api/experiment')
@RequiredPermissions(Permission.SysPrefAdmin)
export class ExperimentController {
  constructor(
    private readonly apikeyDB: ApiKeyDbService,
  ){}

  @Get()
  @Returns(UserInfoResponse)
  async testRoute(
    @Request() req: AuthFasityRequest,
    @ReqUserID() thing: string,
  ): Promise<UserInfoResponse> {
    return req.user;
  }
}
