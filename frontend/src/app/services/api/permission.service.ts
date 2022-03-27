import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { AllPermissionsResponse } from 'picsur-shared/dist/dto/api/info.dto';
import { UserMePermissionsResponse } from 'picsur-shared/dist/dto/api/user.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { ApiService } from './api.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly logger = console;

  constructor(private userService: UserService, private api: ApiService) {
    this.onUser();
  }

  // TODO: add full permission list as default
  public get live(): Observable<string[]> {
    return this.permissionsSubject.pipe(
      map((permissions) => permissions ?? [])
    );
  }

  public get snapshot(): string[] {
    return this.permissionsSubject.getValue() ?? [];
  }

  // This will not be optimistic, it will instead wait for correct data
  public loadedSnapshot(): Promise<string[]> {
    return new Promise((resolve) => {
      const filtered = this.permissionsSubject.pipe(
        filter((permissions) => permissions !== null),
        take(1)
      );
      (filtered as Observable<string[]>).subscribe(resolve);
    });
  }

  private permissionsSubject = new BehaviorSubject<string[] | null>(null);

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

  private async fetchPermissions(): AsyncFailable<string[]> {
    const got = await this.api.get(
      UserMePermissionsResponse,
      '/api/user/me/permissions'
    );
    if (HasFailed(got)) return got;

    return got.permissions;
  }

  public async fetchAllPermission(): AsyncFailable<string[]> {
    const result = await this.api.get(
      AllPermissionsResponse,
      '/api/info/permissions'
    );

    if (HasFailed(result)) return result;

    return result.Permissions;
  }
}
