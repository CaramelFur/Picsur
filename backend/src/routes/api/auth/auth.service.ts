import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtDataDto } from 'imagur-shared/dist/dto/auth.dto';
import { EUser } from 'imagur-shared/dist/entities/user.entity';
import { AsyncFailable, HasFailed, Fail } from 'imagur-shared/dist/types';
import { UsersService } from '../../../collections/userdb/userdb.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async createUser(username: string, password: string): AsyncFailable<EUser> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.usersService.create(username, hashedPassword);
  }

  async deleteUser(user: string | EUser): AsyncFailable<EUser> {
    return this.usersService.delete(user);
  }

  async listUsers(): AsyncFailable<EUser[]> {
    return this.usersService.findAll();
  }

  async authenticate(username: string, password: string): AsyncFailable<EUser> {
    const user = await this.usersService.findOne(username, true);
    if (HasFailed(user)) return user;

    if (!(await bcrypt.compare(password, user.password)))
      return Fail('Wrong password');

    return await this.usersService.findOne(username);
  }

  async createToken(user: EUser): Promise<string> {
    const jwtData: JwtDataDto = {
      user,
    };

    return this.jwtService.signAsync(jwtData);
  }

  async makeAdmin(user: string | EUser): AsyncFailable<true> {
    return this.usersService.modifyAdmin(user, true);
  }

  async revokeAdmin(user: string | EUser): AsyncFailable<true> {
    return this.usersService.modifyAdmin(user, false);
  }
}
