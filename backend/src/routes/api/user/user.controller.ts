import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Request
} from '@nestjs/common';
import {
  UserLoginResponse,
  UserMePermissionsResponse,
  UserMeResponse,
  UserRegisterRequest,
  UserRegisterResponse
} from 'picsur-shared/dist/dto/api/user.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { UserRolesService } from '../../../collections/userdb/userrolesdb.service';
import {
  NoPermissions,
  RequiredPermissions,
  UseLocalAuth
} from '../../../decorators/permissions.decorator';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import { Permission } from '../../../models/dto/permissions.dto';
import AuthFasityRequest from '../../../models/requests/authrequest.dto';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(
    private usersService: UsersService,
    private userRolesSerivce: UserRolesService,
    private authService: AuthManagerService,
  ) {}

  @Post('login')
  @UseLocalAuth(Permission.UserLogin)
  async login(@Request() req: AuthFasityRequest): Promise<UserLoginResponse> {
    return {
      jwt_token: await this.authService.createToken(req.user),
    };
  }

  @Post('register')
  @RequiredPermissions(Permission.UserRegister)
  async register(
    @Body() register: UserRegisterRequest,
  ): Promise<UserRegisterResponse> {
    const user = await this.usersService.create(
      register.username,
      register.password,
    );
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not register user');
    }

    return user;
  }

  @Get('me')
  @RequiredPermissions(Permission.UserKeepLogin)
  async me(@Request() req: AuthFasityRequest): Promise<UserMeResponse> {
    const user = await this.usersService.findOne(req.user.username);

    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not get user');
    }

    return {
      user,
      token: await this.authService.createToken(user),
    };
  }

  // You can always check your permissions
  @Get('me/permissions')
  @NoPermissions()
  async refresh(
    @Request() req: AuthFasityRequest,
  ): Promise<UserMePermissionsResponse> {
    const permissions = await this.userRolesSerivce.getPermissions(req.user);
    if (HasFailed(permissions)) {
      this.logger.warn(permissions.getReason());
      throw new InternalServerErrorException('Could not get permissions');
    }

    return { permissions };
  }
}
