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
  SpecialRolesResponse
} from 'picsur-shared/dist/dto/api/roles.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { RoleModel } from 'src/app/models/forms-dto/role.dto';
import { ApiService } from './api.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(
    private apiService: ApiService,
    private cacheService: CacheService
  ) {}

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

  public async getSpecialRoles(): AsyncFailable<SpecialRolesResponse> {
    const cached = this.cacheService.get<SpecialRolesResponse>('specialRoles');
    if (cached !== null) {
      return cached;
    }

    const result = await this.apiService.get(
      SpecialRolesResponse,
      '/api/roles/special'
    );

    if (HasFailed(result)) {
      return result;
    }

    this.cacheService.set('specialRoles', result);

    return result;
  }

  public async getSpecialRolesOptimistic(): Promise<SpecialRolesResponse> {
    const result = await this.getSpecialRoles();
    if (HasFailed(result)) {
      return {
        DefaultRoles: [],
        ImmutableRoles: [],
        SoulBoundRoles: [],
        UndeletableRoles: [],
      };
    }

    return result;
  }
}
