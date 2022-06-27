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
import { UsersService } from '../../../collections/user-db/user-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/constants/permissions.const';
import {
  ImmutableUsersList,
  LockedLoginUsersList,
  UndeletableUsersList
} from '../../../models/constants/special-users.const';
import { EUserBackend2EUser } from '../../../models/transformers/user.transformer';

@Controller('api/user')
@RequiredPermissions(Permission.UserAdmin)
export class UserAdminController {
  private readonly logger = new Logger('UserAdminController');

  constructor(private readonly usersService: UsersService) {}

  @Post('list')
  @Returns(UserListResponse)
  async listUsersPaged(
    @Body() body: UserListRequest,
  ): Promise<UserListResponse> {
    const found = await this.usersService.findMany(body.count, body.page);
    if (HasFailed(found)) {
      this.logger.warn(found.getReason());
      throw new InternalServerErrorException('Could not list users');
    }

    found.results = found.results.map(EUserBackend2EUser);
    return found;
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
