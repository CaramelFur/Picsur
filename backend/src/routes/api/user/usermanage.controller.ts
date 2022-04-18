import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import {
  GetSpecialUsersResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserDeleteRequest,
  UserDeleteResponse,
  UserInfoRequest,
  UserInfoResponse,
  UserListRequest,
  UserListResponse,
  UserUpdateRequest,
  UserUpdateResponse
} from 'picsur-shared/dist/dto/api/user-manage.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/dto/permissions.dto';
import {
  ImmutableUsersList,
  LockedLoginUsersList,
  UndeletableUsersList
} from '../../../models/dto/specialusers.dto';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Controller('api/user')
@RequiredPermissions(Permission.UserManage)
export class UserManageController {
  private readonly logger = new Logger('UserManageController');

  constructor(private usersService: UsersService) {}

  @Get('list')
  @Returns(UserListResponse)
  async listUsers(): Promise<UserListResponse> {
    return this.listUsersPaged({
      count: 20,
      page: 0,
    });
  }

  @Post('list')
  @Returns(UserListResponse)
  async listUsersPaged(
    @Body() body: UserListRequest,
  ): Promise<UserListResponse> {
    const users = await this.usersService.findMany(body.count, body.page);
    if (HasFailed(users)) {
      this.logger.warn(users.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    return {
      users: users.map(EUserBackend2EUser),
      count: users.length,
      page: body.page,
    };
  }

  @Post('create')
  @Returns(UserCreateResponse)
  async register(
    @Body() create: UserCreateRequest,
  ): Promise<UserCreateResponse> {
    const user = await this.usersService.create(
      create.username,
      create.password,
      create.roles,
    );
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not create user');
    }

    return EUserBackend2EUser(user);
  }

  @Post('delete')
  @Returns(UserDeleteResponse)
  async delete(@Body() body: UserDeleteRequest): Promise<UserDeleteResponse> {
    const user = await this.usersService.delete(body.id);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not delete user');
    }

    return EUserBackend2EUser(user);
  }

  @Post('info')
  @Returns(UserInfoResponse)
  async getUser(@Body() body: UserInfoRequest): Promise<UserInfoResponse> {
    const user = await this.usersService.findOne(body.id);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    return EUserBackend2EUser(user);
  }

  @Post('update')
  @Returns(UserUpdateResponse)
  async setPermissions(
    @Body() body: UserUpdateRequest,
  ): Promise<UserUpdateResponse> {
    let user = await this.usersService.findOne(body.id);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    if (body.roles) {
      user = await this.usersService.setRoles(body.id, body.roles);
      if (HasFailed(user)) {
        this.logger.warn(user.getReason());
        throw new InternalServerErrorException('Could not update user');
      }
    }

    if (body.password) {
      user = await this.usersService.updatePassword(body.id, body.password);
      if (HasFailed(user)) {
        this.logger.warn(user.getReason());
        throw new InternalServerErrorException('Could not update user');
      }
    }

    return EUserBackend2EUser(user);
  }

  @Get('special')
  @Returns(GetSpecialUsersResponse)
  async getSpecial(): Promise<GetSpecialUsersResponse> {
    return {
      ImmutableUsersList,
      LockedLoginUsersList,
      UndeletableUsersList,
    };
  }
}
