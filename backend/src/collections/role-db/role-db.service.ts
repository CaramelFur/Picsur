import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERoleSchema } from 'picsur-shared/dist/entities/role.entity';
import {
    AsyncFailable,
    Fail,
    FT,
    HasFailed,
    HasSuccess,
} from 'picsur-shared/dist/types/failable';
import { makeUnique } from 'picsur-shared/dist/util/unique';
import { In, Repository } from 'typeorm';
import { ERoleBackend } from '../../database/entities/users/role.entity.js';
import { Permissions } from '../../models/constants/permissions.const.js';
import {
    ImmutableRolesList,
    RolePermissionsLocks,
    UndeletableRolesList,
} from '../../models/constants/roles.const.js';

@Injectable()
export class RoleDbService {
  private readonly logger = new Logger(RoleDbService.name);

  constructor(
    @InjectRepository(ERoleBackend)
    private readonly rolesRepository: Repository<ERoleBackend>,
  ) {}

  public async create(
    name: string,
    permissions: Permissions,
  ): AsyncFailable<ERoleBackend> {
    if (await this.exists(name))
      return Fail(FT.Conflict, 'Role already exists');

    const role = new ERoleBackend();
    role.name = name;
    role.permissions = permissions;

    try {
      return await this.rolesRepository.save(role, { reload: true });
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async delete(name: string): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.findOne(name);
    if (HasFailed(roleToModify)) return roleToModify;

    if (UndeletableRolesList.includes(roleToModify.name)) {
      return Fail(FT.Permission, 'Cannot delete system role');
    }

    try {
      return await this.rolesRepository.remove(roleToModify);
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async getPermissions(roles: string[]): AsyncFailable<Permissions> {
    const foundRoles = await this.findMany(roles);
    if (HasFailed(foundRoles)) return foundRoles;

    const permissions = foundRoles.reduce(
      (acc, role) => [...acc, ...role.permissions],
      [] as Permissions,
    );

    return makeUnique(permissions);
  }

  public async addPermissions(
    name: string,
    permissions: Permissions,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.findOne(name);
    if (HasFailed(roleToModify)) return roleToModify;

    const newPermissions = makeUnique([
      ...roleToModify.permissions,
      ...permissions,
    ]);

    return this.setPermissions(roleToModify, newPermissions);
  }

  public async removePermissions(
    name: string,
    permissions: Permissions,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.findOne(name);
    if (HasFailed(roleToModify)) return roleToModify;

    const newPermissions = roleToModify.permissions.filter(
      (permission) => !permissions.includes(permission),
    );

    return this.setPermissions(roleToModify, newPermissions);
  }

  // Permission specific validation is done here
  public async setPermissions(
    role: string | ERoleBackend,
    permissions: Permissions,
    // Extra bypass for internal use
    allowImmutable = false,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.resolve(role);
    if (HasFailed(roleToModify)) return roleToModify;

    if (!allowImmutable && ImmutableRolesList.includes(roleToModify.name)) {
      return Fail(FT.Permission, 'Cannot modify immutable role');
    }

    // If the permission are missing a role specified in RolePermissionsLocks[roleToModify.name], fail
    const missingPermissions = RolePermissionsLocks[roleToModify.name].filter(
      (permission) => !permissions.includes(permission),
    );
    if (missingPermissions.length > 0) {
      return Fail(
        FT.Permission,
        `Cannot remove permissions: ${missingPermissions.join(', ')}`,
      );
    }

    roleToModify.permissions = makeUnique(permissions);

    try {
      return await this.rolesRepository.save(roleToModify);
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async findOne(name: string): AsyncFailable<ERoleBackend> {
    try {
      const found = await this.rolesRepository.findOne({
        where: { name },
      });

      if (!found) return Fail(FT.NotFound, 'Role not found');
      return found;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async findMany(names: string[]): AsyncFailable<ERoleBackend[]> {
    try {
      const found = await this.rolesRepository.find({
        where: { name: In(names) },
        order: { name: 'ASC' },
      });

      if (!found) return Fail(FT.NotFound, 'No roles found');
      return found;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async findAll(): AsyncFailable<ERoleBackend[]> {
    try {
      const found = await this.rolesRepository.find({
        order: { name: 'ASC' },
      });
      if (!found) return Fail(FT.NotFound, 'No roles found');
      return found;
    } catch (e) {
      return Fail(FT.Database, e);
    }
  }

  public async exists(name: string): Promise<boolean> {
    return HasSuccess(await this.findOne(name));
  }

  public async nukeSystemRoles(IAmSure = false): AsyncFailable<true> {
    if (!IAmSure)
      return Fail(
        FT.SysValidation,
        'You must confirm that you want to delete all roles',
      );

    try {
      await this.rolesRepository.delete({
        name: In(UndeletableRolesList),
      });
    } catch (e) {
      return Fail(FT.Database, e);
    }
    return true;
  }

  private async resolve(
    role: string | ERoleBackend,
  ): AsyncFailable<ERoleBackend> {
    if (typeof role === 'string') {
      return await this.findOne(role);
    } else {
      const result = ERoleSchema.safeParse(role);
      if (!result.success) {
        return Fail(FT.SysValidation, result.error);
      }
      // This is safe
      return result.data as ERoleBackend;
    }
  }
}
