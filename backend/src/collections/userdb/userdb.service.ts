import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import {
  AsyncFailable,
  Fail,
  HasFailed,
  HasSuccess,
} from 'picsur-shared/dist/types';
import { Repository } from 'typeorm';
import { GetCols } from '../collectionutils';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(EUser)
    private usersRepository: Repository<EUser>,
  ) {}

  public async create(
    username: string,
    hashedPassword: string,
  ): AsyncFailable<EUser> {
    if (await this.exists(username)) return Fail('User already exists');

    let user = new EUser();
    user.username = username;
    user.password = hashedPassword;

    try {
      user = await this.usersRepository.save(user, { reload: true });
    } catch (e: any) {
      return Fail(e?.message);
    }

    return plainToClass(EUser, user); // Strips unwanted data
  }

  // Returns user object without id
  public async delete(user: string | EUser): AsyncFailable<EUser> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    try {
      return await this.usersRepository.remove(userToModify);
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findOne<B extends true | undefined = undefined>(
    username: string,
    getPrivate?: B,
  ): AsyncFailable<B extends undefined ? EUser : Required<EUser>> {
    try {
      const found = await this.usersRepository.findOne({
        where: { username },
        select: getPrivate ? GetCols(this.usersRepository) : undefined,
      });

      if (!found) return Fail('User not found');
      return found as B extends undefined ? EUser : Required<EUser>;
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async findAll(): AsyncFailable<EUser[]> {
    try {
      return await this.usersRepository.find();
    } catch (e: any) {
      return Fail(e?.message);
    }
  }

  public async exists(username: string): Promise<boolean> {
    return HasSuccess(await this.findOne(username));
  }

  public async modifyAdmin(
    user: string | EUser,
    admin: boolean,
  ): AsyncFailable<true> {
    const userToModify = await this.resolve(user);
    if (HasFailed(userToModify)) return userToModify;

    userToModify.isAdmin = admin;
    await this.usersRepository.save(userToModify);

    return true;
  }

  private async resolve(user: string | EUser): AsyncFailable<EUser> {
    if (typeof user === 'string') {
      return await this.findOne(user);
    } else {
      user = plainToClass(EUser, user);
      const errors = await validate(user, { forbidUnknownValues: true });
      if (errors.length > 0) {
        this.logger.warn(errors);
        return Fail('Invalid user');
      }
      return user;
    }
  }
}
