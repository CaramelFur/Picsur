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
import {
  RegisterRequestDto,
  LoginResponseDto,
  DeleteRequestDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { AdminGuard } from './admin.guard';
import { HasFailed } from 'imagur-shared/dist/types';
import AuthFasityRequest from './authrequest';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: AuthFasityRequest) {
    const response: LoginResponseDto = {
      access_token: await this.authService.createToken(req.user),
    };

    return response;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  async register(
    @Request() req: AuthFasityRequest,
    @Body() register: RegisterRequestDto,
  ) {
    const user = await this.authService.createUser(
      register.username,
      register.password,
    );

    if (HasFailed(user)) throw new ConflictException('User already exists');

    if (register.isAdmin) {
      await this.authService.makeAdmin(user);
    }

    return this.authService.userEntityToUser(user);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('delete')
  async delete(
    @Request() req: AuthFasityRequest,
    @Body() deleteData: DeleteRequestDto,
  ) {
    const user = await this.authService.deleteUser(deleteData.username);
    if (HasFailed(user)) throw new NotFoundException('User does not exist');

    return this.authService.userEntityToUser(user);
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
    return req.user;
  }
}
