import { Injectable } from '@angular/core';
import { AllPermissionsResponse } from 'picsur-shared/dist/dto/api/info.dto';
import { SpecialRolesResponse } from 'picsur-shared/dist/dto/api/roles.dto';
import { GetSpecialUsersResponse } from 'picsur-shared/dist/dto/api/usermanage.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { CacheService } from '../storage/cache.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class StaticInfoService {
  constructor(private api: ApiService, private cache: CacheService) {}

  public async getSpecialRoles(): Promise<SpecialRolesResponse> {
    return this.cache.getFallback(
      'specialRoles',
      {
        DefaultRoles: [],
        ImmutableRoles: [],
        SoulBoundRoles: [],
        UndeletableRoles: [],
      },
      () => this.api.get(SpecialRolesResponse, '/api/roles/special')
    );
  }

  public async getSpecialUsers(): Promise<GetSpecialUsersResponse> {
    return this.cache.getFallback(
      'specialUsers',
      {
        ImmutableUsersList: [],
        LockedLoginUsersList: [],
        UndeletableUsersList: [],
      },
      () => this.api.get(GetSpecialUsersResponse, '/api/user/special')
    );
  }

  public async getAllPermissions(): Promise<string[]> {
    return this.cache.getFallback(
      'allPermissions',
      // "error" works fine, it is not a valid permission, but will display where necessary and will otherwise be ignored
      ['error'] as string[],
      async () => {
        const res = await this.api.get(
          AllPermissionsResponse,
          '/api/info/permissions'
        );
        if (HasFailed(res)) return res;
        return res.Permissions;
      }
    );
  }
}
