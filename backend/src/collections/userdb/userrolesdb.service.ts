import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { makeUnique } from 'picsur-shared/dist/util/unique';
import { Repository } from 'typeorm';
import { Permissions } from '../../models/dto/permissions.dto';
import { EUserBackend } from '../../models/entities/user.entity';
import { RolesService } from '../roledb/roledb.service';
import { UsersService } from './userdb.service';

// Move some code here so it doesnt make the userdb service gigantic

@Injectable()
export class UserRolesService {
  private readonly logger = new Logger('UserRolesService');

  constructor(
    @InjectRepository(EUserBackend)
    private usersRepository: Repository<EUserBackend>,

    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

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

    const newRoles = makeUnique([...userToModify.roles, ...roles]);

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

  public async removeRoleEveryone(role: string): AsyncFailable<true> {
    try {
      await this.usersRepository
        .createQueryBuilder('user')
        .update()
        .set({
          roles: () => 'ARRAY_REMOVE(roles, :role)',
        })
        .where('roles @> ARRAY[:role]', { role })
        .execute();
    } catch (e) {
      this.logger.error(e);
      return Fail("Couldn't remove role from everyone");
    }

    return true;
  }
}
