import {
  Controller, Get,
  Request
} from '@nestjs/common';
import { UserInfoResponse } from 'picsur-shared/dist/dto/api/usermanage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import AuthFasityRequest from '../../../models/requests/authrequest.dto';



@Controller('api/experiment')
@RequiredPermissions(Permission.Settings)
export class ExperimentController {
  @Get()
  @Returns(UserInfoResponse)
  async testRoute(
    @Request() req: AuthFasityRequest,
    @ReqUserID() thing: string,
  ): Promise<UserInfoResponse> {

    return req.user;
  }
}
