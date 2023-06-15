import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  UserCheckNameRequest,
  UserCheckNameResponse,
  UserLoginResponse,
  UserMePermissionsResponse,
  UserMeResponse,
  UserRegisterRequest,
  UserRegisterResponse,
} from 'picsur-shared/dist/dto/api/user.dto';
import type { EUser } from 'picsur-shared/dist/entities/user.entity';
import { ThrowIfFailed } from 'picsur-shared/dist/types/failable';
import { UserDbService } from '../../../collections/user-db/user-db.service';
import {
  NoPermissions,
  RequiredPermissions,
  UseLocalAuth,
} from '../../../decorators/permissions.decorator';
import { ReqUser, ReqUserID } from '../../../decorators/request-user.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import { Permission } from '../../../models/constants/permissions.const';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly usersService: UserDbService,
    private readonly authService: AuthManagerService,
  ) {}

  @Post('login')
  @Returns(UserLoginResponse)
  @UseLocalAuth(Permission.UserLogin)
  @Throttle(30, 300)
  async login(@ReqUser() user: EUser): Promise<UserLoginResponse> {
    const jwt_token = ThrowIfFailed(await this.authService.createToken(user));

    return { jwt_token };
  }

  @Post('register')
  @Returns(UserRegisterResponse)
  @RequiredPermissions(Permission.UserRegister)
  @Throttle(5, 300)
  async register(
    @Body() register: UserRegisterRequest,
  ): Promise<UserRegisterResponse> {
    const user = ThrowIfFailed(
      await this.usersService.create(register.username, register.password),
    );

    return EUserBackend2EUser(user);
  }

  @Post('checkname')
  @Returns(UserCheckNameResponse)
  @RequiredPermissions(Permission.UserRegister)
  @Throttle(20)
  async checkName(
    @Body() checkName: UserCheckNameRequest,
  ): Promise<UserCheckNameResponse> {
    return ThrowIfFailed(
      await this.usersService.checkUsername(checkName.username),
    );
  }

  @Get('me')
  @Returns(UserMeResponse)
  @RequiredPermissions(Permission.UserKeepLogin)
  @Throttle(10)
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
  @Throttle(20)
  async refresh(
    @ReqUserID() userid: string,
  ): Promise<UserMePermissionsResponse> {
    const permissions = ThrowIfFailed(
      await this.usersService.getPermissions(userid),
    );

    return { permissions };
  }
}
