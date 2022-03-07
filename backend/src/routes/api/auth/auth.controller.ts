import {
  Body, Controller, Get, InternalServerErrorException, Post, Request, UseGuards
} from '@nestjs/common';
import {
  AuthDeleteRequest,
  AuthLoginResponse,
  AuthMeResponse,
  AuthRegisterRequest
} from 'picsur-shared/dist/dto/auth.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import { AdminGuard } from '../../../managers/auth/guards/admin.guard';
import { JwtAuthGuard } from '../../../managers/auth/guards/jwt.guard';
import { LocalAuthGuard } from '../../../managers/auth/guards/localauth.guard';
import AuthFasityRequest from '../../../models/dto/authrequest.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthManagerService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthFasityRequest) {
    const response: AuthLoginResponse = {
      jwt_token: await this.authService.createToken(req.user),
    };

    return response;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('delete')
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('list')
  async listUsers(@Request() req: AuthFasityRequest) {
    const users = this.authService.listUsers();
    if (HasFailed(users)) {
      console.warn(users.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: AuthFasityRequest) {
    const meResponse: AuthMeResponse = new AuthMeResponse();
    meResponse.user = req.user;
    meResponse.newJwtToken = await this.authService.createToken(req.user);

    return meResponse;
  }
}
