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
  RoleDeleteRequest,
  RoleInfoRequest,
  RoleUpdateRequest
} from 'picsur-shared/dist/dto/api/roles.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { RolesService } from '../../../collections/roledb/roledb.service';
import { RequiredPermissions } from '../../../decorators/permissions.decorator';

@Controller('api/roles')
@RequiredPermissions('role-manage')
export class RolesController {
  private readonly logger = new Logger('RolesController');

  constructor(private rolesService: RolesService) {}

  @Get('/list')
  getRoles() {
    const roles = this.rolesService.findAll();
    if (HasFailed(roles)) {
      this.logger.warn(roles.getReason());
      throw new InternalServerErrorException('Could not list roles');
    }

    return roles;
  }

  @Post('/info')
  getRole(@Body() body: RoleInfoRequest) {
    const role = this.rolesService.findOne(body.name);
    if (HasFailed(role)) {
      this.logger.warn(role.getReason());
      throw new InternalServerErrorException('Could not find role');
    }

    return role;
  }

  @Post('/permissions/set')
  updateRole(@Body() body: RoleUpdateRequest) {
    const updatedRole = this.rolesService.setPermissions(
      body.name,
      body.permissions,
    );
    if (HasFailed(updatedRole)) {
      this.logger.warn(updatedRole.getReason());
      throw new InternalServerErrorException('Could not set role permissions');
    }

    return updatedRole;
  }

  @Post('/permissions/add')
  addPermissions(@Body() body: RoleUpdateRequest) {
    const updatedRole = this.rolesService.addPermissions(
      body.name,
      body.permissions,
    );
    if (HasFailed(updatedRole)) {
      this.logger.warn(updatedRole.getReason());
      throw new InternalServerErrorException('Could not add role permissions');
    }

    return updatedRole;
  }

  @Post('/permissions/remove')
  removePermissions(@Body() body: RoleUpdateRequest) {
    const updatedRole = this.rolesService.removePermissions(
      body.name,
      body.permissions,
    );
    if (HasFailed(updatedRole)) {
      this.logger.warn(updatedRole.getReason());
      throw new InternalServerErrorException(
        'Could not remove role permissions',
      );
    }

    return updatedRole;
  }

  @Post('/create')
  createRole(@Body() role: RoleCreateRequest) {
    const newRole = this.rolesService.create(role.name, role.permissions);
    if (HasFailed(newRole)) {
      this.logger.warn(newRole.getReason());
      throw new InternalServerErrorException('Could not create role');
    }

    return newRole;
  }

  @Post('/delete')
  deleteRole(@Body() role: RoleDeleteRequest) {
    const deletedRole = this.rolesService.delete(role.name);
    if (HasFailed(deletedRole)) {
      this.logger.warn(deletedRole.getReason());
      throw new InternalServerErrorException('Could not delete role');
    }

    return deletedRole;
  }
}
