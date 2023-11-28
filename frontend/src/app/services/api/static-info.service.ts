import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { AllPermissionsResponse } from 'picsur-shared/dist/dto/api/info.dto';
import { SpecialRolesResponse } from 'picsur-shared/dist/dto/api/roles.dto';
import { GetSpecialUsersResponse } from 'picsur-shared/dist/dto/api/user-manage.dto';
import { Open } from 'picsur-shared/dist/types/failable';
import { CacheService } from '../storage/cache.service';
import { ApiService } from './api.service';
import { InfoService } from './info.service';

@Injectable({
  providedIn: 'root',
})
export class StaticInfoService {
  constructor(
    private readonly api: ApiService,
    private readonly info: InfoService,
    private readonly cache: CacheService,
  ) {
    this.subscribeVersion();
  }

  public async getSpecialRoles(): Promise<SpecialRolesResponse> {
    return this.cache.getFallback(
      'specialRoles',
      {
        DefaultRoles: [],
        ImmutableRoles: [],
        SoulBoundRoles: [],
        UndeletableRoles: [],
        LockedPermissions: {},
      },
      () => this.api.get(SpecialRolesResponse, '/api/roles/special').result,
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
      () => this.api.get(GetSpecialUsersResponse, '/api/user/special').result,
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
          '/api/info/permissions',
        ).result;
        return Open(res, 'permissions');
      },
    );
  }

  @AutoUnsubscribe()
  private subscribeVersion() {
    return this.info.live.subscribe((info) => {
      this.cache.setVersion(info.version);
    });
  }
}
