import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AsyncMaybe, Nothing } from 'src/lib/maybe';
import { User } from 'src/users/user.dto';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtDataDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(username: string, password: string): AsyncMaybe<UserEntity> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.usersService.createUser(username, hashedPassword);
  }

  async deleteUser(user: string | UserEntity): AsyncMaybe<UserEntity> {
    return this.usersService.removeUser(user);
  }

  async listUsers(): Promise<User[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => this.userEntityToUser(user));
  }

  async authenticate(
    username: string,
    password: string,
  ): AsyncMaybe<UserEntity> {
    const user = await this.usersService.findOne(username);

    if (user === Nothing) return Nothing;

    if (!(await bcrypt.compare(password, user.password))) return Nothing;

    return user;
  }

  async createToken(user: UserEntity): Promise<string> {
    const jwtData: JwtDataDto = {
      user: {
        username: user.username,
        isAdmin: user.isAdmin,
      },
    };

    return this.jwtService.signAsync(jwtData);
  }

  async makeAdmin(user: string | UserEntity): Promise<boolean> {
    return this.usersService.modifyAdmin(user, true);
  }

  async revokeAdmin(user: string | UserEntity): Promise<boolean> {
    return this.usersService.modifyAdmin(user, false);
  }

  userEntityToUser(user: UserEntity): User {
    return {
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }
}
