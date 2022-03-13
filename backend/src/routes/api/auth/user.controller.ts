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
  UserDeleteRequest,
  UserDeleteResponse,
  UserInfoRequest,
  UserInfoResponse,
  UserListResponse,
  UserLoginResponse,
  UserMePermissionsResponse,
  UserMeResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  UserUpdateRolesRequest,
  UserUpdateRolesResponse
} from 'picsur-shared/dist/dto/api/user.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import {
  NoPermissions,
  RequiredPermissions,
  UseLocalAuth
} from '../../../decorators/permissions.decorator';
import { AuthManagerService } from '../../../managers/auth/auth.service';
import AuthFasityRequest from '../../../models/dto/authrequest.dto';

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger('AuthController');

  constructor(
    private usersService: UsersService,
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

  @Post('delete')
  @RequiredPermissions(Permission.UserManage)
  async delete(
    @Body() deleteData: UserDeleteRequest,
  ): Promise<UserDeleteResponse> {
    const user = await this.usersService.delete(deleteData.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not delete user');
    }

    return user;
  }

  @Post('roles')
  @RequiredPermissions(Permission.UserManage)
  async setPermissions(
    @Body() body: UserUpdateRolesRequest,
  ): Promise<UserUpdateRolesResponse> {
    const updatedUser = await this.usersService.setRoles(
      body.username,
      body.roles,
    );

    if (HasFailed(updatedUser)) {
      this.logger.warn(updatedUser.getReason());
      throw new InternalServerErrorException('Could not update user');
    }

    return updatedUser;
  }

  @Post('info')
  @RequiredPermissions(Permission.UserManage)
  async getUser(@Body() body: UserInfoRequest): Promise<UserInfoResponse> {
    const user = await this.usersService.findOne(body.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    return user;
  }

  @Get('list')
  @RequiredPermissions(Permission.UserManage)
  async listUsers(): Promise<UserListResponse> {
    const users = await this.usersService.findAll();
    if (HasFailed(users)) {
      this.logger.warn(users.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    return {
      users,
      total: users.length,
    };
  }

  @Get('me')
  @RequiredPermissions(Permission.UserView)
  async me(@Request() req: AuthFasityRequest): Promise<UserMeResponse> {
    return {
      user: req.user,
      token: await this.authService.createToken(req.user),
    };
  }

  // You can always check your permissions
  @Get('me/permissions')
  @NoPermissions()
  async refresh(
    @Request() req: AuthFasityRequest,
  ): Promise<UserMePermissionsResponse> {
    const permissions = await this.usersService.getPermissions(req.user);
    if (HasFailed(permissions)) {
      this.logger.warn(permissions.getReason());
      throw new InternalServerErrorException('Could not get permissions');
    }

    return { permissions };
  }
}
