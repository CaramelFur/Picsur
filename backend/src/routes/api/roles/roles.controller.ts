import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
  SpecialRolesResponse,
} from 'picsur-shared/dist/dto/api/roles.dto';
import { Fail, FT, ThrowIfFailed } from 'picsur-shared/dist/types';
import { RoleDbService } from '../../../collections/role-db/role-db.service';
import { UserDbService } from '../../../collections/user-db/user-db.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';
import { Returns } from '../../../decorators/returns.decorator';
import { Permission } from '../../../models/constants/permissions.const';
import {
  DefaultRolesList,
  ImmutableRolesList,
  SoulBoundRolesList,
  UndeletableRolesList,
} from '../../../models/constants/roles.const';
import { isPermissionsArray } from '../../../models/validators/permissions.validator';

@Controller('api/roles')
@RequiredPermissions(Permission.RoleAdmin)
export class RolesController {
  private readonly logger = new Logger(RolesController.name);

  constructor(
    private readonly rolesService: RoleDbService,
    private readonly usersService: UserDbService,
  ) {}

  @Get('list')
  @Returns(RoleListResponse)
  async getRoles(): Promise<RoleListResponse> {
    const roles = ThrowIfFailed(await this.rolesService.findAll());

    return {
      results: roles,
      total: roles.length,
    };
  }

  @Post('info')
  @Returns(RoleInfoResponse)
  async getRole(@Body() body: RoleInfoRequest): Promise<RoleInfoResponse> {
    const role = ThrowIfFailed(await this.rolesService.findOne(body.name));

    return role;
  }

  @Post('update')
  @Returns(RoleUpdateResponse)
  @Throttle(20)
  async updateRole(
    @Body() body: RoleUpdateRequest,
  ): Promise<RoleUpdateResponse> {
    const permissions = body.permissions;
    if (!isPermissionsArray(permissions)) {
      throw Fail(FT.UsrValidation, 'Invalid permissions array');
    }

    const updatedRole = ThrowIfFailed(
      await this.rolesService.setPermissions(body.name, permissions),
    );

    return updatedRole;
  }

  @Post('create')
  @Returns(RoleCreateResponse)
  @Throttle(10)
  async createRole(
    @Body() role: RoleCreateRequest,
  ): Promise<RoleCreateResponse> {
    const permissions = role.permissions;
    if (!isPermissionsArray(permissions)) {
      throw Fail(FT.UsrValidation, 'Invalid permissions array');
    }

    const newRole = ThrowIfFailed(
      await this.rolesService.create(role.name, permissions),
    );

    return newRole;
  }

  @Post('delete')
  @Returns(RoleDeleteResponse)
  async deleteRole(
    @Body() role: RoleDeleteRequest,
  ): Promise<RoleDeleteResponse> {
    const deletedRole = ThrowIfFailed(
      await this.rolesService.delete(role.name),
    );

    ThrowIfFailed(await this.usersService.removeRoleEveryone(role.name));

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
