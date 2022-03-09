import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { MainAuthGuard } from '../../../managers/auth/guards/main.guard';
import AuthFasityRequest from '../../../models/dto/authrequest.dto';

@Controller('api/experiment')
export class ExperimentController {
  @Get()
  @UseGuards(MainAuthGuard)
  async testRoute(@Request() req: AuthFasityRequest) {
    console.log("calledroutes")
    return {
      message: req.user,
    };
  }
}
