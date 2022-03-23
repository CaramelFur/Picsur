import { Injectable } from '@angular/core';
import { RoleListResponse } from 'picsur-shared/dist/dto/api/roles.dto';
import { ERole } from 'picsur-shared/dist/entities/role.entity';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
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
}
