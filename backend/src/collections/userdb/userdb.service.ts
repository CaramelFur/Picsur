import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess
} from 'picsur-shared/dist/types';
import { makeUnique } from 'picsur-shared/dist/util/unique';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { Repository } from 'typeorm';
import { Permissions } from '../../models/dto/permissions.dto';
import {
  DefaultRolesList,
  SoulBoundRolesList
} from '../../models/dto/roles.dto';
import {
  ImmutableUsersList,
  LockedLoginUsersList,
  UndeletableUsersList
} from '../../models/dto/specialusers.dto';
import { EUserBackend } from '../../models/entities/user.entity';
import { GetCols } from '../../models/util/collection';
import { RolesService } from '../roledb/roledb.service';

// TODO: make this a configurable value
const BCryptStrength = 12;

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(EUserBackend)
    private usersRepository: Repository<EUserBackend>,
    private rolesService: RolesService,
  ) {}

  // Creation and deletion

  public async create(
    username: string,
    password: string,
    roles?: string[],
    // Add option to create "invalid" users, should only be used by system
    byPassRoleCheck?: boolean,
  ): AsyncFailable<EUserBackend> {
    if (await this.exists(username)) return Fail('User already exists');

    const hashedPassword = await bcrypt.hash(password, BCryptStrength);

    let user = new EUserBackend();
    user.username = username;
    user.password = hashedPassword;
    if (byPassRoleCheck) {
      const rolesToAdd = roles ?? [];
      user.roles = makeUnique(rolesToAdd);
    } else {
      // Strip soulbound roles and add default roles
      const rolesToAdd = this.filterAddedRoles(roles ?? []);
      user.roles = makeUnique([...DefaultRolesList, ...rolesToAdd]);
    }

    try {
      user = await this.usersRepository.save(user, { reload: true });
    } catch (e: any) {
      return Fail(e?.message);
    }

    // Strips unwanted data
    return plainToClass(EUserBackend, user);
  }

  public async delete(
    user: string | EUserBackend,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    if (UndeletableUsersList.includes(userToModify.username)) {
      return Fail('Cannot delete system user');
    }

    try {
      return await this.usersRepository.remove(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  // Updating

  public async setRoles(
    user: string | EUserBackend,
    roles: string[],
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    if (ImmutableUsersList.includes(userToModify.username)) {
      // Just fail silently
      this.logger.log("Can't modify system user");
      return userToModify;
    }

    const rolesToKeep = userToModify.roles.filter((role) =>
      SoulBoundRolesList.includes(role),
    );
    const rolesToAdd = this.filterAddedRoles(roles);
    const newRoles = makeUnique([...rolesToKeep, ...rolesToAdd]);
    userToModify.roles = newRoles;

    try {
      return await this.usersRepository.save(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
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

  public async getPermissions(
    user: string | EUserBackend,
  ): AsyncFailable<Permissions> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    return await this.rolesService.getPermissions(userToModify.roles);
  }

  public async updatePassword(
    user: string | EUserBackend,
    password: string,
  ): AsyncFailable<EUserBackend> {
    let userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const hashedPassword = await bcrypt.hash(password, BCryptStrength);
    userToModify.password = hashedPassword;

    try {
      userToModify = await this.usersRepository.save(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }

    // Strips unwanted data
    return plainToClass(EUserBackend, userToModify);
  }

  // Authentication

  async authenticate(
    username: string,
    password: string,
  ): AsyncFailable<EUserBackend> {
    const user = await this.findOne(username, true);
    if (HasFailed(user)) return user;

    if (LockedLoginUsersList.includes(user.username)) {
      // Error should be kept in backend
      return Fail('Wrong username');
    }

    if (!(await bcrypt.compare(password, user.password)))
      return Fail('Wrong password');

    return await this.findOne(username);
  }

  // Listing

  public async findOne<B extends true | undefined = undefined>(
    username: string,
    // Also fetch fields that aren't normally sent to the client
    // (e.g. hashed password)
    getPrivate?: B,
  ): AsyncFailable<
    B extends undefined ? EUserBackend : Required<EUserBackend>
  > {
    try {
      const found = await this.usersRepository.findOne({
        where: { username },
        select: getPrivate ? GetCols(this.usersRepository) : undefined,
      });

      if (!found) return Fail('User not found');
      return found as B extends undefined
        ? EUserBackend
        : Required<EUserBackend>;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findMany(
    count: number,
    page: number,
  ): AsyncFailable<EUserBackend[]> {
    if (count < 1 || page < 0) return Fail('Invalid page');
    if (count > 100) return Fail('Too many results');

    try {
      return await this.usersRepository.find({
        take: count,
        skip: count * page,
      });
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async exists(username: string): Promise<boolean> {
    return HasSuccess(await this.findOne(username));
  }

  // Internal resolver

  private async resolve(
    user: string | EUserBackend,
  ): AsyncFailable<EUserBackend> {
    if (typeof user === 'string') {
      return await this.findOne(user);
    } else {
      user = plainToClass(EUserBackend, user);
      const errors = await strictValidate(user);
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid user');
      }
      return user;
    }
  }

  private filterAddedRoles(roles: string[]): string[] {
    const filteredRoles = roles.filter(
      (role) => !SoulBoundRolesList.includes(role),
    );

    return filteredRoles;
  }
}
