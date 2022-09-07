import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {
  UserCheckNameRequest,
  UserCheckNameResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserMeResponse,
  UserRegisterRequest,
  UserRegisterResponse,
} from 'picsur-shared/dist/dto/api/user.dto';
import { JwtDataSchema } from 'picsur-shared/dist/dto/jwt.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import {
  AsyncFailable,
  Fail,
  FT,
  HasFailed,
  Open,
} from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '../logger/logger.service';
import { KeyService } from '../storage/key.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private userSubject = new BehaviorSubject<EUser | null>(null);

  public get live() {
    return this.userSubject.asObservable();
  }

  public get snapshot() {
    return this.userSubject.getValue();
  }

  public get isLoggedIn() {
    return this.userSubject.getValue() !== null;
  }

  constructor(
    private readonly api: ApiService,
    private readonly key: KeyService,
  ) {
    this.init().catch(this.logger.error);
  }

  private async init() {
    const apikey = await this.key.get();
    if (!apikey) return;

    const fetchedUser = await this.fetchUser();
    if (HasFailed(fetchedUser)) {
      this.logger.error(fetchedUser.getReason());
      await this.logout();
      return;
    }

    this.userSubject.next(fetchedUser);
  }

  public async login(username: string, password: string): AsyncFailable<EUser> {
    const response = await this.api.post(
      UserLoginRequest,
      UserLoginResponse,
      '/api/user/login',
      {
        username,
        password,
      },
    );
    if (HasFailed(response)) return response;

    // Set the key so the apiservice can use it
    this.key.set(response.jwt_token);

    const user = await this.fetchUser();
    if (HasFailed(user)) return user;

    this.userSubject.next(user);
    return user;
  }

  public async checkNameIsAvailable(username: string): AsyncFailable<boolean> {
    return Open(
      await this.api.post(
        UserCheckNameRequest,
        UserCheckNameResponse,
        '/api/user/checkname',
        {
          username,
        },
      ),
      'available',
    );
  }

  public async register(
    username: string,
    password: string,
  ): AsyncFailable<EUser> {
    return await this.api.post(
      UserRegisterRequest,
      UserRegisterResponse,
      '/api/user/register',
      {
        username,
        password,
      },
    );
  }

  public async logout(): AsyncFailable<EUser> {
    const value = this.snapshot;

    this.key.clear();
    this.userSubject.next(null);

    if (value === null) {
      return Fail(FT.Impossible, 'Not logged in');
    } else {
      return value;
    }
  }

  // This extracts the available userdata from the jwt token
  private async extractUserID(token: string): AsyncFailable<string> {
    let decoded: any;
    try {
      decoded = jwt_decode(token);
    } catch (e) {
      return Fail(FT.UsrValidation, 'Invalid token');
    }

    const result = JwtDataSchema.safeParse(decoded);
    if (!result.success) {
      this.logger.error(result.error);
      return Fail(FT.UsrValidation, 'Invalid token data');
    }

    return result.data.uid;
  }

  // This actually fetches up to date information from the server
  private async fetchUser(): AsyncFailable<EUser> {
    const got = await this.api.get(UserMeResponse, '/api/user/me');
    if (HasFailed(got)) return got;

    this.key.set(got.token);
    return got.user;
  }
}
