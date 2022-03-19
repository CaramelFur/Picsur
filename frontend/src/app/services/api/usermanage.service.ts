import { Injectable } from '@angular/core';
import {
  UserListRequest,
  UserListResponse
} from 'picsur-shared/dist/dto/api/usermanage.dto';
import { EUser } from 'picsur-shared/dist/entities/user.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserManageService {
  constructor(private apiService: ApiService) {}

  public async getUsers(count: number, page: number): AsyncFailable<EUser[]> {
    const body = {
      count,
      page,
    };

    const result = await this.apiService.post(
      UserListRequest,
      UserListResponse,
      '/api/user/list',
      body
    );

    if (HasFailed(result)) {
      return result;
    }

    return result.users;
  }
}
