import { Injectable } from '@angular/core';
import {
  RoleCreateRequest,
  RoleCreateResponse,
  RoleDeleteRequest,
  RoleDeleteResponse,
  RoleInfoRequest,
  RoleInfoResponse,
  RoleListResponse,
  RoleUpdateRequest,
  RoleUpdateResponse
} from 'picsur-shared/dist/dto/api/roles.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { RoleModel } from 'src/app/models/forms/role.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private apiService: ApiService) {}

  public async getRoles(): AsyncFailable<ERole[]> {
    const result = await this.apiService.get(
      RoleListResponse,
      '/api/roles/list'
    );

    if (HasFailed(result)) {
      return result;
    }

    return result.roles;
  }

  public async getRole(name: string): AsyncFailable<ERole> {
    const body = {
      name,
    };

    const result = await this.apiService.post(
      RoleInfoRequest,
      RoleInfoResponse,
      '/api/roles/info',
      body
    );

    return result;
  }

  public async createRole(role: RoleModel): AsyncFailable<ERole> {
    const result = await this.apiService.post(
      RoleCreateRequest,
      RoleCreateResponse,
      '/api/roles/create',
      role
    );

    return result;
  }

  public async updateRole(role: RoleModel): AsyncFailable<ERole> {
    const result = await this.apiService.post(
      RoleUpdateRequest,
      RoleUpdateResponse,
      '/api/roles/update',
      role
    );

    return result;
  }

  public async deleteRole(name: string): AsyncFailable<ERole> {
    const body = {
      name,
    };

    const result = await this.apiService.post(
      RoleDeleteRequest,
      RoleDeleteResponse,
      '/api/roles/delete',
      body
    );

    return result;
  }
}
