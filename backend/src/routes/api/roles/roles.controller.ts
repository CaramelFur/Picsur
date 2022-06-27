import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import {
  RoleCreateRequest,
  RoleCreateResponse,
  RoleDeleteRequest,
  RoleDeleteResponse,
  RoleInfoRequest,
  RoleInfoResponse,
  RoleListResponse,
  RoleUpdateRequest,
  RoleUpdateResponse,
  SpecialRolesResponse
} from 'picsur-shared/dist/dto/api/roles.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { RolesService } from '../../../collections/role-db/role-db.service';
import { UsersService } from '../../../collections/user-db/user-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/constants/permissions.const';
import {
  DefaultRolesList,
  ImmutableRolesList,
  SoulBoundRolesList,
  UndeletableRolesList
} from '../../../models/constants/roles.const';
import { isPermissionsArray } from '../../../models/validators/permissions.validator';

@Controller('api/roles')
@RequiredPermissions(Permission.RoleAdmin)
export class RolesController {
  private readonly logger = new Logger('RolesController');

  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('list')
  @Returns(RoleListResponse)
  async getRoles(): Promise<RoleListResponse> {
    const roles = await this.rolesService.findAll();
    if (HasFailed(roles)) {
      this.logger.warn(roles.getReason());
      throw new InternalServerErrorException('Could not list roles');
    }

    return {
      results: roles,
      total: roles.length,
    };
  }

  @Post('info')
  @Returns(RoleInfoResponse)
  async getRole(@Body() body: RoleInfoRequest): Promise<RoleInfoResponse> {
    const role = await this.rolesService.findOne(body.name);
    if (HasFailed(role)) {
      this.logger.warn(role.getReason());
      throw new InternalServerErrorException('Could not find role');
    }

    return role;
  }

  @Post('update')
  @Returns(RoleUpdateResponse)
  async updateRole(
    @Body() body: RoleUpdateRequest,
  ): Promise<RoleUpdateResponse> {
    const permissions = body.permissions;
    if (!isPermissionsArray(permissions)) {
      throw new InternalServerErrorException('Invalid permissions');
    }

    const updatedRole = await this.rolesService.setPermissions(
      body.name,
      permissions,
    );
    if (HasFailed(updatedRole)) {
      this.logger.warn(updatedRole.getReason());
      throw new InternalServerErrorException('Could not set role permissions');
    }

    return updatedRole;
  }

  @Post('create')
  @Returns(RoleCreateResponse)
  async createRole(
    @Body() role: RoleCreateRequest,
  ): Promise<RoleCreateResponse> {
    const permissions = role.permissions;
    if (!isPermissionsArray(permissions)) {
      throw new InternalServerErrorException('Invalid permissions array');
    }

    const newRole = await this.rolesService.create(role.name, permissions);
    if (HasFailed(newRole)) {
      this.logger.warn(newRole.getReason());
      throw new InternalServerErrorException('Could not create role');
    }

    return newRole;
  }

  @Post('delete')
  @Returns(RoleDeleteResponse)
  async deleteRole(
    @Body() role: RoleDeleteRequest,
  ): Promise<RoleDeleteResponse> {
    const deletedRole = await this.rolesService.delete(role.name);
    if (HasFailed(deletedRole)) {
      this.logger.warn(deletedRole.getReason());
      throw new InternalServerErrorException('Could not delete role');
    }

    const success = await this.usersService.removeRoleEveryone(role.name);
    if (HasFailed(success)) {
      this.logger.warn(success.getReason());
      throw new InternalServerErrorException(
        'Could not remove role from users',
      );
    }

    return deletedRole;
  }

  @Get('special')
  @Returns(SpecialRolesResponse)
  async getSpecialRoles(): Promise<SpecialRolesResponse> {
    return {
      SoulBoundRoles: SoulBoundRolesList,
      ImmutableRoles: ImmutableRolesList,
      UndeletableRoles: UndeletableRolesList,
      DefaultRoles: DefaultRolesList,
    };
  }
}
