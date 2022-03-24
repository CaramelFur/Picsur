import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import {
  ImmuteableRolesList,
  Roles,
  SystemRolesList
} from 'picsur-shared/dist/dto/roles.dto';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess
} from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { In, Repository } from 'typeorm';
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
      role = await this.rolesRepository.save(role, { reload: true });
    } catch (e: any) {
      return Fail(e?.message);
    }

    return plainToClass(ERoleBackend, role);
  }

  public async delete(
    role: string | ERoleBackend,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.resolve(role);
    if (HasFailed(roleToModify)) return roleToModify;

    if (SystemRolesList.includes(roleToModify.name)) {
      return Fail('Cannot delete system role');
    }

    try {
      return await this.rolesRepository.remove(roleToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async getPermissions(roles: Roles): AsyncFailable<Permissions> {
    const permissions: Permissions = [];
    const foundRoles = await Promise.all(
      roles.map((role: string) => this.findOne(role)),
    );

    for (const foundRole of foundRoles) {
      if (HasFailed(foundRole)) return foundRole;
      permissions.push(...foundRole.permissions);
    }

    return [...new Set(...[permissions])];
  }

  public async addPermissions(
    role: string | ERoleBackend,
    permissions: Permissions,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.resolve(role);
    if (HasFailed(roleToModify)) return roleToModify;

    // This is stupid
    const newPermissions = [
      ...new Set([...roleToModify.permissions, ...permissions]),
    ];

    return this.setPermissions(roleToModify, newPermissions);
  }

  public async removePermissions(
    role: string | ERoleBackend,
    permissions: Permissions,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.resolve(role);
    if (HasFailed(roleToModify)) return roleToModify;

    const newPermissions = roleToModify.permissions.filter(
      (permission) => !permissions.includes(permission),
    );

    return this.setPermissions(roleToModify, newPermissions);
  }

  public async setPermissions(
    role: string | ERoleBackend,
    permissions: Permissions,
    allowImmutable: boolean = false,
  ): AsyncFailable<ERoleBackend> {
    const roleToModify = await this.resolve(role);
    if (HasFailed(roleToModify)) return roleToModify;

    if (!allowImmutable && ImmuteableRolesList.includes(roleToModify.name)) {
      return Fail('Cannot modify immutable role');
    }

    roleToModify.permissions = [...new Set(permissions)];

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
      return found as ERoleBackend;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findAll(): AsyncFailable<ERoleBackend[]> {
    try {
      const found = await this.rolesRepository.find();
      if (!found) return Fail('No roles found');
      return found as ERoleBackend[];
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async exists(username: string): Promise<boolean> {
    return HasSuccess(await this.findOne(username));
  }

  public async nukeSystemRoles(iamsure: boolean = false): AsyncFailable<true> {
    if (!iamsure) return Fail('Nuke aborted');
    try {
      await this.rolesRepository.delete({
        name: In(SystemRolesList),
      });
    } catch (e: any) {
      return Fail(e?.message);
    }
    return true;
  }

  private async resolve(
    user: string | ERoleBackend,
  ): AsyncFailable<ERoleBackend> {
    if (typeof user === 'string') {
      return await this.findOne(user);
    } else {
      user = plainToClass(ERoleBackend, user);
      const errors = await strictValidate(user);
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid role');
      }
      return user;
    }
  }
}
