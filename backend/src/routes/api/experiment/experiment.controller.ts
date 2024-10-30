import { Controller } from '@nestjs/common';
import { NoPermissions } from '../../../decorators/permissions.decorator.js';
@Controller('api/experiment')
@NoPermissions()
export class ExperimentController {
  // @Get()
  // @Returns(UserInfoResponse)
  // async testRoute(
  //   @Request() req: AuthFastifyRequest,
  //   @Response({ passthrough: true }) res: FastifyReply,
  // ): Promise<UserInfoResponse> {
  //   res.header('Location', '/error/delete-success');
  //   res.code(302);
  //   return req.user;
  // }
}
