import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import {
  UserLoginResponse,
  UserMePermissionsResponse,
  UserMeResponse,
  UserRegisterRequest,
  UserRegisterResponse
} from 'picsur-shared/dist/dto/api/user.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/user-db/user-db.service';
import {
  NoPermissions,
  RequiredPermissions,
  UseLocalAuth
} from '../../../decorators/permissions.decorator';
import { ReqUser, ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import { Permission } from '../../../models/constants/permissions.const';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(
    private usersService: UsersService,
    private authService: AuthManagerService,
  ) {}

  @Post('login')
  @Returns(UserLoginResponse)
  @UseLocalAuth(Permission.UserLogin)
  async login(@ReqUser() user: EUser): Promise<UserLoginResponse> {
    const jwt_token = await this.authService.createToken(user);
    if (HasFailed(jwt_token)) {
      this.logger.warn(jwt_token.getReason());
      throw new InternalServerErrorException('Could not get new token');
    }

    return { jwt_token };
  }

  @Post('register')
  @Returns(UserRegisterResponse)
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
  @Returns(UserMeResponse)
  @RequiredPermissions(Permission.UserKeepLogin)
  async me(@ReqUserID() userid: string): Promise<UserMeResponse> {
    const backenduser = await this.usersService.findOne(userid);

    if (HasFailed(backenduser)) {
      this.logger.warn(backenduser.getReason());
      throw new InternalServerErrorException('Could not get user');
    }

    const user = EUserBackend2EUser(backenduser);

    const token = await this.authService.createToken(user);
    if (HasFailed(token)) {
      this.logger.warn(token.getReason());
      throw new InternalServerErrorException('Could not get new token');
    }

    return { user, token };
  }

  // You can always check your permissions
  @Get('me/permissions')
  @Returns(UserMePermissionsResponse)
  @NoPermissions()
  async refresh(
    @ReqUserID() userid: string,
  ): Promise<UserMePermissionsResponse> {
    const permissions = await this.usersService.getPermissions(userid);
    if (HasFailed(permissions)) {
      this.logger.warn(permissions.getReason());
      throw new InternalServerErrorException('Could not get permissions');
    }

    return { permissions };
  }
}
