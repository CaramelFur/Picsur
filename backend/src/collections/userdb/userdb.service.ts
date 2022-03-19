import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { PermanentRolesList, Roles } from 'picsur-shared/dist/dto/roles.dto';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess
} from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { Repository } from 'typeorm';
import { EUserBackend } from '../../models/entities/user.entity';
import { GetCols } from '../collectionutils';
import { RolesService } from '../roledb/roledb.service';

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
    roles?: Roles,
  ): AsyncFailable<EUserBackend> {
    if (await this.exists(username)) return Fail('User already exists');

    const hashedPassword = await bcrypt.hash(password, 12);

    let user = new EUserBackend();
    user.username = username;
    user.password = hashedPassword;
    user.roles = ['user', ...(roles || [])];

    try {
      user = await this.usersRepository.save(user, { reload: true });
    } catch (e: any) {
      return Fail(e?.message);
    }

    return plainToClass(EUserBackend, user); // Strips unwanted data
  }

  // Returns user object without id
  public async delete(
    user: string | EUserBackend,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    try {
      return await this.usersRepository.remove(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  // Authentication

  async authenticate(
    username: string,
    password: string,
  ): AsyncFailable<EUserBackend> {
    const user = await this.findOne(username, true);
    if (HasFailed(user)) return user;

    if (!(await bcrypt.compare(password, user.password)))
      return Fail('Wrong password');

    return await this.findOne(username);
  }

  // Permissions and roles

  public async getPermissions(
    user: string | EUserBackend,
  ): AsyncFailable<Permissions> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    return await this.rolesService.getPermissions(userToModify.roles);
  }

  public async addRoles(
    user: string | EUserBackend,
    roles: Roles,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const newRoles = [...new Set([...userToModify.roles, ...roles])];

    return this.setRoles(userToModify, newRoles);
  }

  public async removeRoles(
    user: string | EUserBackend,
    roles: Roles,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const newRoles = userToModify.roles.filter((role) => !roles.includes(role));

    return this.setRoles(userToModify, newRoles);
  }

  public async setRoles(
    user: string | EUserBackend,
    roles: Roles,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const rolesToKeep = userToModify.roles.filter((role) =>
      PermanentRolesList.includes(role),
    );
    const newRoles = [...new Set([...rolesToKeep, ...roles])];

    userToModify.roles = newRoles;

    try {
      return await this.usersRepository.save(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  // Listing

  public async findOne<B extends true | undefined = undefined>(
    username: string,
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
}
