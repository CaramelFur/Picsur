import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import {
  UserDeleteRequest,
  UserDeleteResponse,
  UserInfoRequest,
  UserInfoResponse,
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
}
