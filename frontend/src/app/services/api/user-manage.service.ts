import { Injectable } from '@angular/core';
import {
  UserCreateRequest,
  UserCreateResponse,
  UserDeleteRequest,
  UserDeleteResponse,
  UserInfoRequest,
  UserInfoResponse,
  UserListRequest,
  UserListResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from 'picsur-shared/dist/dto/api/user-manage.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { AsyncFailable } from 'picsur-shared/dist/types/failable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  constructor(private readonly api: ApiService) {}

  public async getUser(id: string): AsyncFailable<EUser> {
    return await this.api.post(
      UserInfoRequest,
      UserInfoResponse,
      'api/user/info',
      { id },
    ).result;
  }

  public async getUsers(
    count: number,
    page: number,
  ): AsyncFailable<UserListResponse> {
    return await this.api.post(
      UserListRequest,
      UserListResponse,
      '/api/user/list',
      {
        count,
        page,
      },
    ).result;
  }

  public async createUser(user: UserCreateRequest): AsyncFailable<EUser> {
    return await this.api.post(
      UserCreateRequest,
      UserCreateResponse,
      '/api/user/create',
      user,
    ).result;
  }

  public async updateUser(user: UserUpdateRequest): AsyncFailable<EUser> {
    return await this.api.post(
      UserUpdateRequest,
      UserUpdateResponse,
      '/api/user/update',
      user,
    ).result;
  }

  public async deleteUser(id: string): AsyncFailable<Omit<EUser, 'id'>> {
    return await this.api.post(
      UserDeleteRequest,
      UserDeleteResponse,
      '/api/user/delete',
      { id },
    ).result;
  }
}
