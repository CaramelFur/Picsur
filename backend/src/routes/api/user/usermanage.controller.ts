import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import {
  UserCreateRequest,
  UserCreateResponse,
  UserDeleteRequest,
  UserDeleteResponse,
  UserInfoRequest,
  UserInfoResponse,
  UserListRequest,
  UserListResponse,
  UserUpdateRolesRequest,
  UserUpdateRolesResponse
} from 'picsur-shared/dist/dto/api/usermanage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';

@Controller('api/user')
@RequiredPermissions(Permission.UserManage)
export class UserManageController {
  private readonly logger = new Logger('UserManageController');

  constructor(private usersService: UsersService) {}

  @Get('list')
  async listUsers(): Promise<UserListResponse> {
    const body = new UserListRequest();
    body.count = 20;
    body.page = 0;

    return this.listUsersPaged(body);
  }

  @Post('list')
  async listUsersPaged(
    @Body() body: UserListRequest,
  ): Promise<UserListResponse> {
    const users = await this.usersService.findMany(body.count, body.page);
    if (HasFailed(users)) {
      this.logger.warn(users.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    return {
      users,
      count: users.length,
      page: body.page,
    };
  }

  @Post('create')
  async register(
    @Body() create: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    const user = await this.usersService.create(
      create.username,
      create.password,
    );
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not create user');
    }

    return user;
  }

  @Post('delete')
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

  @Post('info')
  async getUser(@Body() body: UserInfoRequest): Promise<UserInfoResponse> {
    console.log(body);
    const user = await this.usersService.findOne(body.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    return user;
  }

  @Post('roles')
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
}
