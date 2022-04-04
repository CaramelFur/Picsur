import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERoleSchema } from 'picsur-shared/dist/entities/role.entity';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess
} from 'picsur-shared/dist/types';
import { makeUnique } from 'picsur-shared/dist/util/unique';
import { In, Repository } from 'typeorm';
import { Permissions } from '../../models/dto/permissions.dto';
import {
  ImmutableRolesList,
  UndeletableRolesList
} from '../../models/dto/roles.dto';
import { ERoleBackend } from '../../models/entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(ERoleBackend)
    private rolesRepository: Repository<ERoleBackend>,
  ) {}

  public async create(
    name: string,
    permissions: Permissions,
  ): AsyncFailable<ERoleBackend> {
    if (await this.exists(name)) return Fail('Role already exists');

    let role = new ERoleBackend();
    role.name = name;
    role.permissions = permissions;

    try {
      return await this.rolesRepository.save(role, { reload: true });
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async delete(name: string): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.findOne(name);
    if (HasFailed(roleToModify)) return roleToModify;

    if (UndeletableRolesList.includes(roleToModify.name)) {
      return Fail('Cannot delete system role');
    }

    try {
      return await this.rolesRepository.remove(roleToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async getPermissions(roles: string[]): AsyncFailable<Permissions> {
    const permissions: Permissions = [];
    const foundRoles = await Promise.all(
      roles.map((role: string) => this.findOne(role)),
    );

    for (const foundRole of foundRoles) {
      if (HasFailed(foundRole)) return foundRole;
      permissions.push(...foundRole.permissions);
    }

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
    allowImmutable: boolean = false,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.resolve(role);
    if (HasFailed(roleToModify)) return roleToModify;

    if (!allowImmutable && ImmutableRolesList.includes(roleToModify.name)) {
      return Fail('Cannot modify immutable role');
    }

    roleToModify.permissions = makeUnique(permissions);

    try {
      return await this.rolesRepository.save(roleToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findOne(name: string): AsyncFailable<ERoleBackend> {
    try {
      const found = await this.rolesRepository.findOne({
        where: { name },
      });

      if (!found) return Fail('Role not found');
      return found;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findAll(): AsyncFailable<ERoleBackend[]> {
    try {
      const found = await this.rolesRepository.find();
      if (!found) return Fail('No roles found');
      return found;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async exists(name: string): Promise<boolean> {
    return HasSuccess(await this.findOne(name));
  }

  public async nukeSystemRoles(IAmSure: boolean = false): AsyncFailable<true> {
    if (!IAmSure)
      return Fail('You must confirm that you want to delete all roles');

    try {
      await this.rolesRepository.delete({
        name: In(UndeletableRolesList),
      });
    } catch (e: any) {
      return Fail(e?.message);
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
        this.logger.warn(result.error);
        return Fail('Invalid role');
      }
      // This is safe
      return result.data as ERoleBackend;
    }
  }
}
