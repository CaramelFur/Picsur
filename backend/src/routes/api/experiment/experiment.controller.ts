import { Controller, Get, Request, Response } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { UserInfoResponse } from 'picsur-shared/dist/dto/api/user-manage.dto';
import { NoPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import type AuthFastifyRequest from '../../../models/interfaces/authrequest.dto';
@Controller('api/experiment')
@NoPermissions()
export class ExperimentController {
  constructor() {}

  @Get()
  @Returns(UserInfoResponse)
  async testRoute(
    @Request() req: AuthFastifyRequest,
    @Response({ passthrough: true }) res: FastifyReply,
  ): Promise<UserInfoResponse> {
    res.header('Location', '/error/delete-success');
    res.code(302);
    return req.user;
  }
}
