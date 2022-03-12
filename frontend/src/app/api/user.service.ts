import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import jwt_decode from 'jwt-decode';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserMeResponse
} from 'picsur-shared/dist/dto/api/user.dto';
import { JwtDataDto } from 'picsur-shared/dist/dto/jwt.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { KeyService } from './key.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly logger = console;

  public get liveUser() {
    return this.userSubject;
  }

  public get user() {
    return this.userSubject.getValue();
  }

  public get isLoggedIn() {
    return this.userSubject.getValue() !== null;
  }

  private userSubject = new BehaviorSubject<EUser | null>(null);

  constructor(private api: ApiService, private key: KeyService) {
    this.init().catch(this.logger.error);
  }

  public async login(username: string, password: string): AsyncFailable<EUser> {
    const request: UserLoginRequest = {
      username,
      password,
    };

    const response = await this.api.post(
      UserLoginRequest,
      UserLoginResponse,
      '/api/user/login',
      request
    );

    if (HasFailed(response)) return response;
    this.key.set(response.jwt_token);

    const user = await this.fetchUser();
    if (HasFailed(user)) return user;

    this.userSubject.next(user);
    return user;
  }

  public async logout(): AsyncFailable<EUser> {
    const value = this.userSubject.getValue();
    this.key.clear();
    this.userSubject.next(null);
    if (value === null) {
      return Fail('Not logged in');
    } else {
      return value;
    }
  }

  private async init() {
    const apikey = await this.key.get();
    if (!apikey) return;

    const user = await this.extractUser(apikey);
    if (HasFailed(user)) {
      this.logger.warn(user.getReason());
      await this.logout();
      return;
    }

    this.userSubject.next(user);

    const fetchedUser = await this.fetchUser();
    if (HasFailed(fetchedUser)) {
      this.logger.warn(fetchedUser.getReason());
      await this.logout();
      return;
    }

    this.userSubject.next(fetchedUser);
  }

  private async extractUser(token: string): AsyncFailable<EUser> {
    let decoded: any;
    try {
      decoded = jwt_decode(token);
    } catch (e) {
      return Fail('Invalid token');
    }

    const jwtData = plainToClass(JwtDataDto, decoded);
    const errors = await validate(jwtData);
    if (errors.length > 0) {
      this.logger.warn(errors);
      return Fail('Invalid token data');
    }

    return jwtData.user;
  }

  private async fetchUser(): AsyncFailable<EUser> {
    const got = await this.api.get(UserMeResponse, '/api/user/me');
    if (HasFailed(got)) return got;

    this.key.set(got.newJwtToken);
    return got.user;
  }
}
