import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  AuthDeleteRequest,
  AuthLoginResponse,
  AuthMeResponse,
  AuthRegisterRequest
} from 'picsur-shared/dist/dto/auth.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { Authenticated } from '../../../decorators/authenticated';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import { LocalAuthGuard } from '../../../managers/auth/guards/localauth.guard';
import AuthFasityRequest from '../../../models/dto/authrequest.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthManagerService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthFasityRequest) {
    const response: AuthLoginResponse = {
      jwt_token: await this.authService.createToken(req.user),
    };

    return response;
  }

  @Post('create')
  @Authenticated(true)
  async register(
    @Request() req: AuthFasityRequest,
    @Body() register: AuthRegisterRequest,
  ) {
    const user = await this.authService.createUser(
      register.username,
      register.password,
    );
    if (HasFailed(user)) {
      console.warn(user.getReason());
      throw new InternalServerErrorException('Could not create user');
    }

    if (register.isAdmin) {
      await this.authService.makeAdmin(user);
    }

    return user;
  }

  @Post('delete')
  @Authenticated(true)
  async delete(
    @Request() req: AuthFasityRequest,
    @Body() deleteData: AuthDeleteRequest,
  ) {
    const user = await this.authService.deleteUser(deleteData.username);
    if (HasFailed(user)) {
      console.warn(user.getReason());
      throw new InternalServerErrorException('Could not delete user');
    }

    return user;
  }

  @Get('list')
  @Authenticated(true)
  async listUsers(@Request() req: AuthFasityRequest) {
    const users = this.authService.listUsers();
    if (HasFailed(users)) {
      console.warn(users.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    return users;
  }

  @Get('me')
  @Authenticated()
  async me(@Request() req: AuthFasityRequest) {
    const meResponse: AuthMeResponse = new AuthMeResponse();
    meResponse.user = req.user;
    meResponse.newJwtToken = await this.authService.createToken(req.user);

    return meResponse;
  }
}
