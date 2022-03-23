import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import {
  DefaultRolesList,
  PermanentRolesList,
  Roles
} from 'picsur-shared/dist/dto/roles.dto';
import {
  LockedLoginUsersList,
  LockedPermsUsersList,
  SystemUsersList
} from 'picsur-shared/dist/dto/specialusers.dto';
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
    roles?: Roles,
    byPassRoleCheck?: boolean,
  ): AsyncFailable<EUserBackend> {
    if (await this.exists(username)) return Fail('User already exists');

    const hashedPassword = await bcrypt.hash(password, BCryptStrength);

    let user = new EUserBackend();
    user.username = username;
    user.password = hashedPassword;
    if (byPassRoleCheck) {
      const rolesToAdd = roles ?? [];
      user.roles = [...new Set([...rolesToAdd])];
    } else {
      const rolesToAdd = this.filterAddedRoles(roles ?? []);
      user.roles = [...new Set([...DefaultRolesList, ...rolesToAdd])];
    }

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

    if (SystemUsersList.includes(userToModify.username)) {
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
    roles: Roles,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    if (LockedPermsUsersList.includes(userToModify.username)) {
      // Just fail silently
      return userToModify;
    }

    const rolesToKeep = userToModify.roles.filter((role) =>
      PermanentRolesList.includes(role),
    );
    const rolesToAdd = this.filterAddedRoles(roles);

    const newRoles = [...new Set([...rolesToKeep, ...rolesToAdd])];

    userToModify.roles = newRoles;

    try {
      return await this.usersRepository.save(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async updatePassword(
    user: string | EUserBackend,
    password: string,
  ): AsyncFailable<EUserBackend> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    const hashedPassword = await bcrypt.hash(password, BCryptStrength);

    userToModify.password = hashedPassword;

    try {
      const fullUser = await this.usersRepository.save(userToModify);
      return plainToClass(EUserBackend, fullUser);
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

    if (LockedLoginUsersList.includes(user.username)) {
      return Fail('Wrong password');
    }

    if (!(await bcrypt.compare(password, user.password)))
      return Fail('Wrong password');

    return await this.findOne(username);
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

  public async resolve(
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

  private filterAddedRoles(roles: Roles): Roles {
    const filteredRoles = roles.filter(
      (role) => !PermanentRolesList.includes(role),
    );

    return filteredRoles;
  }
}
