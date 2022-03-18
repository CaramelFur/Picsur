import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { UserMePermissionsResponse } from 'picsur-shared/dist/dto/api/user.dto';
import {
  Permissions,
  PermissionsList
} from 'picsur-shared/dist/dto/permissions';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';

let i = 0;

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly logger = console;
  public counter = 0;

  constructor(
    private userService: UserService,
    private api: ApiService,
    @Optional() @SkipSelf() parent?: PermissionService
  ) {
    this.counter = ++i;
    console.log('PermissionService.constructor(' + this.counter + ')');
    this.onUser();
  }

  public get live(): Observable<Permissions> {
    return this.permissionsSubject.pipe(
      map((permissions) => permissions ?? this.defaultPermissions)
    );
  }

  public get snapshot(): Permissions {
    return this.permissionsSubject.getValue() ?? this.defaultPermissions;
  }

  // This will not be optimistic, it will instead wait for correct data
  public loadedSnapshot(): Promise<Permissions> {
    return new Promise((resolve) => {
      const filtered = this.permissionsSubject.pipe(
        filter((permissions) => permissions !== null),
        take(1)
      );
      (filtered as Observable<Permissions>).subscribe(resolve);
    });
  }

  private defaultPermissions = PermissionsList as Permissions;
  private permissionsSubject = new BehaviorSubject<Permissions | null>(null);

  @AutoUnsubscribe()
  private onUser() {
    return this.userService.live.subscribe(async (user) => {
      console.log('PermissionService.onUser(' + this.counter + ')', user);
      const permissions = await this.fetchPermissions();
      if (HasFailed(permissions)) {
        this.logger.warn(permissions.getReason());
        return;
      }
      console.log('Permissions next', permissions);
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
