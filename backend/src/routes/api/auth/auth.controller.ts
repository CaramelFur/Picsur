import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Request
} from '@nestjs/common';
import { AuthUserInfoRequest } from 'picsur-shared/dist/dto/api/auth.dto';
import {
  AuthDeleteRequest,
  AuthLoginResponse,
  AuthMeResponse,
  AuthRegisterRequest
} from 'picsur-shared/dist/dto/auth.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import {
  RequiredPermissions,
  UseLocalAuth
} from '../../../decorators/permissions.decorator';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import AuthFasityRequest from '../../../models/dto/authrequest.dto';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(
    private usersService: UsersService,
    private authService: AuthManagerService,
  ) {}

  @Post('login')
  @UseLocalAuth('user-login')
  async login(@Request() req: AuthFasityRequest) {
    const response: AuthLoginResponse = {
      jwt_token: await this.authService.createToken(req.user),
    };

    return response;
  }

  @Post('register')
  @RequiredPermissions('user-register')
  async register(
    @Request() req: AuthFasityRequest,
    @Body() register: AuthRegisterRequest,
  ) {
    const user = await this.usersService.create(
      register.username,
      register.password,
    );
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not register user');
    }

    if (register.isAdmin) {
      await this.usersService.addRoles(user, ['admin']);
    }

    return user;
  }

  @Post('delete')
  @RequiredPermissions('user-manage')
  async delete(
    @Request() req: AuthFasityRequest,
    @Body() deleteData: AuthDeleteRequest,
  ) {
    const user = await this.usersService.delete(deleteData.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not delete user');
    }

    return user;
  }

  @Post('info')
  @RequiredPermissions('user-manage')
  async getUser(@Body() body: AuthUserInfoRequest) {
    const user = await this.usersService.findOne(body.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    return user;
  }

  @Get('list')
  @RequiredPermissions('user-manage')
  async listUsers(@Request() req: AuthFasityRequest) {
    const users = this.usersService.findAll();
    if (HasFailed(users)) {
      this.logger.warn(users.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    return users;
  }

  @Get('me')
  @RequiredPermissions('user-view')
  async me(@Request() req: AuthFasityRequest) {
    const permissions = await this.usersService.getPermissions(req.user);
    if (HasFailed(permissions)) {
      this.logger.warn(permissions.getReason());
      throw new InternalServerErrorException('Could not get permissions');
    }

    const meResponse: AuthMeResponse = new AuthMeResponse();
    meResponse.user = req.user;
    meResponse.permissions = permissions;
    meResponse.newJwtToken = await this.authService.createToken(req.user);

    return meResponse;
  }
}
