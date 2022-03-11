import { Controller, Get, Request } from '@nestjs/common';
import { Guest } from '../../../decorators/roles.decorator';
import AuthFasityRequest from '../../../models/dto/authrequest.dto';

@Controller('api/experiment')
export class ExperimentController {
  
  @Get()
  @Guest()
  async testRoute(@Request() req: AuthFasityRequest) {
    return {
      message: req.user,
    };
  }
}
