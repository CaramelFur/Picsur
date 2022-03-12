import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { UserMePermissionsResponse } from 'picsur-shared/dist/dto/api/user.dto';
import {
  Permissions,
  PermissionsList
} from 'picsur-shared/dist/dto/permissions';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable()
export class PermissionService {
  private readonly logger = console;

  constructor(private userService: UserService, private api: ApiService) {
    this.onUser();
  }

  public get live() {
    return this.permissionsSubject;
  }

  public get snapshot() {
    return this.permissionsSubject.getValue();
  }

  // Lets be optimistic for better ux
  private permissionsSubject = new BehaviorSubject<Permissions>(
    PermissionsList as Permissions
  );

  @AutoUnsubscribe()
  private onUser() {
    return this.userService.live.subscribe(async (user) => {
      const permissions = await this.fetchPermissions();
      if (HasFailed(permissions)) {
        this.logger.warn(permissions.getReason());
        return;
      }

      this.permissionsSubject.next(permissions);
    });
  }

  private async fetchPermissions(): AsyncFailable<Permissions> {
    const got = await this.api.get(
      UserMePermissionsResponse,
      '/api/user/me/permissions'
    );
    if (HasFailed(got)) return got;

    return got.permissions;
  }
}
