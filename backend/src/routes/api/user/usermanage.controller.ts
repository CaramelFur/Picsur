import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
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
} from 'picsur-shared/dist/dto/api/usermanage.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Permission } from '../../../models/dto/permissions.dto';
import { ImmutableUsersList, LockedLoginUsersList, UndeletableUsersList } from '../../../models/dto/specialusers.dto';

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
      create.roles,
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
    const user = await this.usersService.findOne(body.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    return user;
  }

  @Post('update')
  async setPermissions(
    @Body() body: UserUpdateRequest,
  ): Promise<UserUpdateResponse> {
    let user = await this.usersService.findOne(body.username);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      throw new InternalServerErrorException('Could not find user');
    }

    if (body.roles) {
      user = await this.usersService.setRoles(user, body.roles);
      if (HasFailed(user)) {
        this.logger.warn(user.getReason());
        throw new InternalServerErrorException('Could not update user');
      }
    }

    if (body.password) {
      user = await this.usersService.updatePassword(user, body.password);
      if (HasFailed(user)) {
        this.logger.warn(user.getReason());
        throw new InternalServerErrorException('Could not update user');
      }
    }

    return user;
  }

  @Get('special')
  async getSpecial(): Promise<GetSpecialUsersResponse> {
    const result: GetSpecialUsersResponse = {
      ImmutableUsersList,
      LockedLoginUsersList,
      UndeletableUsersList,
    };

    return plainToClass(GetSpecialUsersResponse, result);
  }
}
