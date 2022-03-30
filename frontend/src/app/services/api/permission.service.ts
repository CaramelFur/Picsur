import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { UserMePermissionsResponse } from 'picsur-shared/dist/dto/api/user.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { ApiService } from './api.service';
import { StaticInfoService } from './static-info.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly logger = console;

  private allPermissions: string[] = [];
  private permissionsSubject = new BehaviorSubject<string[] | null>(null);

  public get live(): Observable<string[]> {
    return this.permissionsSubject.pipe(
      map((permissions) => permissions ?? this.allPermissions)
    );
  }

  public get snapshot(): string[] {
    return this.permissionsSubject.getValue() ?? this.allPermissions;
  }

  // This will not be optimistic, it will instead wait for correct data
  public getLoadedSnapshot(): Promise<string[]> {
    return new Promise((resolve) => {
      const filtered = this.permissionsSubject.pipe(
        filter((permissions) => permissions !== null),
        take(1)
      );
      (filtered as Observable<string[]>).subscribe(resolve);
    });
  }

  constructor(
    private userService: UserService,
    private api: ApiService,
    private staticInfo: StaticInfoService
  ) {
    this.subscribeUser();
    this.loadAllPermissions().catch(this.logger.error);
  }

  private async loadAllPermissions() {
    this.allPermissions = await this.staticInfo.getAllPermissions();

    if (this.snapshot === null) {
      this.permissionsSubject.next(null);
    }
  }

  @AutoUnsubscribe()
  private subscribeUser() {
    return this.userService.live.subscribe(async (user) => {
      const permissions = await this.updatePermissions();
      if (HasFailed(permissions)) {
        this.logger.warn(permissions.getReason());
        return;
      }
    });
  }

  private async updatePermissions(): AsyncFailable<true> {
    const got = await this.api.get(
      UserMePermissionsResponse,
      '/api/user/me/permissions'
    );
    if (HasFailed(got)) return got;

    this.permissionsSubject.next(got.permissions);
    return true;
  }
}
