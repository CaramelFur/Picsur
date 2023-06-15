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
  RoleUpdateResponse,
} from 'picsur-shared/dist/dto/api/roles.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { AsyncFailable, Open } from 'picsur-shared/dist/types/failable';
import { RoleModel } from '../../models/forms-dto/role.dto';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private readonly api: ApiService) {}

  public async getRoles(): AsyncFailable<ERole[]> {
    const response = await this.api.get(RoleListResponse, '/api/roles/list')
      .result;

    return Open(response, 'results');
  }

  public async getRole(name: string): AsyncFailable<ERole> {
    return await this.api.post(
      RoleInfoRequest,
      RoleInfoResponse,
      '/api/roles/info',
      {
        name,
      },
    ).result;
  }

  public async createRole(role: RoleModel): AsyncFailable<ERole> {
    return await this.api.post(
      RoleCreateRequest,
      RoleCreateResponse,
      '/api/roles/create',
      role,
    ).result;
  }

  public async updateRole(role: RoleModel): AsyncFailable<ERole> {
    return await this.api.post(
      RoleUpdateRequest,
      RoleUpdateResponse,
      '/api/roles/update',
      role,
    ).result;
  }

  public async deleteRole(name: string): AsyncFailable<ERole> {
    return await this.api.post(
      RoleDeleteRequest,
      RoleDeleteResponse,
      '/api/roles/delete',
      {
        name,
      },
    ).result;
  }
}
