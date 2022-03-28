import { Controller, Get, Request } from '@nestjs/common';
import AuthFasityRequest from '../../../models/requests/authrequest.dto';

@Controller('api/experiment')
export class ExperimentController {
  @Get()
  async testRoute(@Request() req: AuthFasityRequest) {
    return {
      message: req.user,
    };
  }
}
