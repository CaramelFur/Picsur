import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { AdminGuard } from './admin.guard';
import { HasFailed } from 'picsur-shared/dist/types';
import AuthFasityRequest from './authrequest';
import {
  AuthDeleteRequest,
  AuthLoginResponse,
  AuthMeResponse,
  AuthRegisterRequest,
} from 'picsur-shared/dist/dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

    if (HasFailed(user)) throw new ConflictException('User already exists');

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
    if (HasFailed(user)) throw new NotFoundException('User does not exist');

    return user;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('list')
  async listUsers(@Request() req: AuthFasityRequest) {
    const users = this.authService.listUsers();

    if (HasFailed(users))
      throw new InternalServerErrorException('Could not list users');

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
