import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AsyncFailable, HasFailed, Fail } from 'imagur-shared/dist/types';
import { User } from '../../../collections/userdb/user.dto';
import { UserEntity } from '../../../collections/userdb/user.entity';
import { UsersService } from '../../../collections/userdb/userdb.service';
import { JwtDataDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(
    username: string,
    password: string,
  ): AsyncFailable<UserEntity> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.usersService.create(username, hashedPassword);
  }

  async deleteUser(user: string | UserEntity): AsyncFailable<UserEntity> {
    return this.usersService.delete(user);
  }

  async listUsers(): AsyncFailable<User[]> {
    const users = await this.usersService.findAll();
    if (HasFailed(users)) return users;

    return users.map((user) => this.userEntityToUser(user));
  }

  async authenticate(
    username: string,
    password: string,
  ): AsyncFailable<UserEntity> {
    const user = await this.usersService.findOne(username);

    if (HasFailed(user)) return user;

    if (!(await bcrypt.compare(password, user.password)))
      return Fail('Wrong password');

    return user;
  }

  async createToken(user: User): Promise<string> {
    const jwtData: JwtDataDto = {
      user: {
        username: user.username,
        isAdmin: user.isAdmin,
      },
    };

    return this.jwtService.signAsync(jwtData);
  }

  async makeAdmin(user: string | UserEntity): AsyncFailable<true> {
    return this.usersService.modifyAdmin(user, true);
  }

  async revokeAdmin(user: string | UserEntity): AsyncFailable<true> {
    return this.usersService.modifyAdmin(user, false);
  }

  userEntityToUser(user: UserEntity): User {
    return {
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }
}
