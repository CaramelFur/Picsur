import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsyncMaybe, Nothing } from 'src/lib/maybe';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    username: string,
    hashedPassword: string,
  ): AsyncMaybe<UserEntity> {
    if (await this.exists(username)) return Nothing;

    const user = new UserEntity();
    user.username = username;
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return user;
  }

  async removeUser(user: string | UserEntity): AsyncMaybe<UserEntity> {
    const userToModify = await this.resolveUser(user);

    if (user === Nothing) return Nothing;

    await this.usersRepository.remove(userToModify);

    return userToModify;
  }

  async findOne(username: string): AsyncMaybe<UserEntity> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async exists(username: string): Promise<boolean> {
    return (await this.findOne(username)) !== Nothing;
  }

  async modifyAdmin(
    user: string | UserEntity,
    admin: boolean,
  ): Promise<boolean> {
    const userToModify = await this.resolveUser(user);

    if (userToModify === Nothing) return false;

    userToModify.isAdmin = admin;
    await this.usersRepository.save(userToModify);

    return true;
  }

  private async resolveUser(user: string | UserEntity): Promise<UserEntity> {
    if (typeof user === 'string') {
      return await this.findOne(user);
    } else {
      return user;
    }
  }
}
