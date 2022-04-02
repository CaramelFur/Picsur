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
import {
  NoPermissions,
  RequiredPermissions,
  UseLocalAuth
} from '../../../decorators/permissions.decorator';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import { Permission } from '../../../models/dto/permissions.dto';
import AuthFasityRequest from '../../../models/requests/authrequest.dto';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(
    private usersService: UsersService,
    private authService: AuthManagerService,
  ) {}

  @Post('login')
  @UseLocalAuth(Permission.UserLogin)
  async login(@Request() req: AuthFasityRequest): Promise<UserLoginResponse> {
    const jwt_token = await this.authService.createToken(req.user);
    if (HasFailed(jwt_token)) {
      this.logger.warn(jwt_token.getReason());
      throw new InternalServerErrorException('Could not get new token');
    }

    return { jwt_token };
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

    return EUserBackend2EUser(user);
  }

  @Get('me')
  @RequiredPermissions(Permission.UserKeepLogin)
  async me(@Request() req: AuthFasityRequest): Promise<UserMeResponse> {
    if (!req.user.id) throw new InternalServerErrorException('User is corrupt');

    const user = await this.usersService.findOne(req.user.id);

    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not get user');
    }

    const token = await this.authService.createToken(user);
    if (HasFailed(token)) {
      this.logger.warn(token.getReason());
      throw new InternalServerErrorException('Could not get new token');
    }

    return { user: EUserBackend2EUser(user), token };
  }

  // You can always check your permissions
  @Get('me/permissions')
  @NoPermissions()
  async refresh(
    @Request() req: AuthFasityRequest,
  ): Promise<UserMePermissionsResponse> {
    if (!req.user.id) throw new InternalServerErrorException('User is corrupt');

    const permissions = await this.usersService.getPermissions(req.user.id);
    if (HasFailed(permissions)) {
      this.logger.warn(permissions.getReason());
      throw new InternalServerErrorException('Could not get permissions');
    }

    return { permissions };
  }
}
