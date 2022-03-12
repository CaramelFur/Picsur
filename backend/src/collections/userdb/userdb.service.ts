import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Permissions } from 'picsur-shared/dist/dto/permissions';
import { PermanentRolesList, Roles } from 'picsur-shared/dist/dto/roles.dto';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess
} from 'picsur-shared/dist/types';
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
  ): AsyncFailable<true> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    // This is stupid
    userToModify.roles = [...new Set([...userToModify.roles, ...roles])];

    try {
      await this.usersRepository.save(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }

    return true;
  }

  public async removeRoles(
    user: string | EUserBackend,
    roles: Roles,
  ): AsyncFailable<true> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    // Make sure we don't remove unremovable roles
    roles = roles.filter((role) => !PermanentRolesList.includes(role));

    userToModify.roles = userToModify.roles.filter(
      (role) => !roles.includes(role),
    );

    try {
      await this.usersRepository.save(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }

    return true;
  }

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

  public async findAll(): AsyncFailable<EUserBackend[]> {
    try {
      return await this.usersRepository.find();
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async exists(username: string): Promise<boolean> {
    return HasSuccess(await this.findOne(username));
  }

  private async resolve(
    user: string | EUserBackend,
  ): AsyncFailable<EUserBackend> {
    if (typeof user === 'string') {
      return await this.findOne(user);
    } else {
      user = plainToClass(EUserBackend, user);
      const errors = await validate(user, { forbidUnknownValues: true });
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid user');
      }
      return user;
    }
  }
}
