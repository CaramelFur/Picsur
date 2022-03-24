import { Injectable } from '@nestjs/common';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { Permissions } from '../../models/dto/permissions.dto';
import { EUserBackend } from '../../models/entities/user.entity';
import { RolesService } from '../roledb/roledb.service';
import { UsersService } from './userdb.service';

@Injectable()
export class UserRolesService {
  constructor(private usersService: UsersService, private rolesService: RolesService){}

  // Permissions and roles

  public async getPermissions(
    user: string | EUserBackend,
  ): AsyncFailable<Permissions> {
    const userToModify = await this.usersService.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    return await this.rolesService.getPermissions(userToModify.roles);
  }

  public async addRoles(
    user: string | EUserBackend,
    roles: string[],
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.usersService.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const newRoles = [...new Set([...userToModify.roles, ...roles])];

    return this.usersService.setRoles(userToModify, newRoles);
  }

  public async removeRoles(
    user: string | EUserBackend,
    roles: string[],
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.usersService.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const newRoles = userToModify.roles.filter((role) => !roles.includes(role));

    return this.usersService.setRoles(userToModify, newRoles);
  }
}
