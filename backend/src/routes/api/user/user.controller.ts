import {
  Body,
  Controller,
  Get, Logger,
  Post
} from '@nestjs/common';
import {
  UserLoginResponse,
  UserMePermissionsResponse,
  UserMeResponse,
  UserRegisterRequest,
  UserRegisterResponse
} from 'picsur-shared/dist/dto/api/user.dto';
import type { EUser } from 'picsur-shared/dist/entities/user.entity';
import { ThrowIfFailed } from 'picsur-shared/dist/types';
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
    private readonly usersService: UsersService,
    private readonly authService: AuthManagerService,
  ) {}

  @Post('login')
  @Returns(UserLoginResponse)
  @UseLocalAuth(Permission.UserLogin)
  async login(@ReqUser() user: EUser): Promise<UserLoginResponse> {
    const jwt_token = ThrowIfFailed(await this.authService.createToken(user));

    return { jwt_token };
  }

  @Post('register')
  @Returns(UserRegisterResponse)
  @RequiredPermissions(Permission.UserRegister)
  async register(
    @Body() register: UserRegisterRequest,
  ): Promise<UserRegisterResponse> {
    const user = ThrowIfFailed(
      await this.usersService.create(register.username, register.password),
    );

    return EUserBackend2EUser(user);
  }

  @Get('me')
  @Returns(UserMeResponse)
  @RequiredPermissions(Permission.UserKeepLogin)
  async me(@ReqUserID() userid: string): Promise<UserMeResponse> {
    const backenduser = ThrowIfFailed(await this.usersService.findOne(userid));

    const user = EUserBackend2EUser(backenduser);

    const token = ThrowIfFailed(await this.authService.createToken(user));

    return { user, token };
  }

  // You can always check your permissions
  @Get('me/permissions')
  @Returns(UserMePermissionsResponse)
  @NoPermissions()
  async refresh(
    @ReqUserID() userid: string,
  ): Promise<UserMePermissionsResponse> {
    const permissions = ThrowIfFailed(await this.usersService.getPermissions(userid));

    return { permissions };
  }
}
