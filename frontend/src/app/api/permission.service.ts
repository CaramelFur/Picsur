import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { UserMePermissionsResponse } from 'picsur-shared/dist/dto/api/user.dto';
import {
  Permissions,
  PermissionsList
} from 'picsur-shared/dist/dto/permissions';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable()
export class PermissionService {
  private readonly logger = console;

  constructor(private userService: UserService, private api: ApiService) {
    this.onUser();
  }

  public get live(): Observable<Permissions> {
    return this.permissionsSubject.pipe(
      filter((v) => v !== null)
    ) as Observable<Permissions>;
  }

  public get snapshot(): Permissions {
    return (
      this.permissionsSubject.getValue() ?? (PermissionsList as Permissions)
    );
  }

  public loadedSnapshot(): Promise<Permissions> {
    return new Promise((resolve) => this.live.pipe(take(1)).subscribe(resolve));
  }

  // Lets be optimistic for better ux
  private permissionsSubject = new BehaviorSubject<Permissions | null>(null);

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
