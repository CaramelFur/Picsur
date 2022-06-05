import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  GetPreferenceResponse,
  MultiplePreferencesResponse,
  UpdatePreferenceRequest,
  UpdatePreferenceResponse,
} from 'picsur-shared/dist/dto/api/pref.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import {
  DecodedPref,
  PrefValueType,
} from 'picsur-shared/dist/dto/preferences.dto';
import { AsyncFailable, Fail, HasFailed, Map } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { Throttle } from 'src/app/util/throttle';
import { UtilService } from 'src/app/util/util-module/util.service';
import { Logger } from '../logger/logger.service';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class SysPrefService {
  private readonly logger = new Logger('SysPrefService');

  private hasPermission = false;

  private sysprefObservable = new BehaviorSubject<DecodedPref[]>([]);

  public get snapshot() {
    return this.sysprefObservable.getValue();
  }

  public get live() {
    return this.sysprefObservable.asObservable();
  }

  constructor(
    private api: ApiService,
    private permissionsService: PermissionService,
    private utilService: UtilService,
  ) {
    this.subscribePermissions();
  }

  private async refresh() {
    const result = await this.getPreferences();
    if (HasFailed(result)) {
      this.utilService.showSnackBar(
        "Couldn't load system preferences",
        SnackBarType.Error,
      );
      this.flush();
    }
  }

  public async getPreferences(): AsyncFailable<DecodedPref[]> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.get(
      MultiplePreferencesResponse,
      '/api/pref/sys',
    );

    return Map(response, (pref) => {
      this.sysprefObservable.next(pref.preferences);
      return pref.preferences;
    });
  }

  public async getPreference(
    key: string,
  ): AsyncFailable<GetPreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.get(
      GetPreferenceResponse,
      `/api/pref/sys/${key}`,
    );

    if (!HasFailed(response)) this.updatePrefArray(response);
    return response;
  }

  public async setPreference(
    key: string,
    value: PrefValueType,
  ): AsyncFailable<UpdatePreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.post(
      UpdatePreferenceRequest,
      UpdatePreferenceResponse,
      `/api/pref/sys/${key}`,
      { value },
    );

    if (!HasFailed(response)) this.updatePrefArray(response);
    return response;
  }

  private updatePrefArray(pref: DecodedPref) {
    const prefArray = this.snapshot;
    // Replace the old pref with the new one
    const index = prefArray.findIndex((i) => pref.key === i.key);
    if (index === -1) {
      const newArray = [...prefArray, pref];
      this.sysprefObservable.next(newArray);
    } else {
      const newArray = [...prefArray];
      newArray[index] = pref;
      this.sysprefObservable.next(newArray);
    }
  }

  private flush() {
    this.sysprefObservable.next([]);
  }

  // We want to flush on logout, because the syspreferences can contain sensitive information
  @AutoUnsubscribe()
  private subscribePermissions() {
    return this.permissionsService.live
      .pipe(Throttle(300))
      .subscribe((permissions) => {
        const oldHasPermission = this.hasPermission;
        this.hasPermission = permissions.includes(Permission.SysPrefAdmin);
        if (!this.hasPermission) {
          this.flush();
        }

        if (!oldHasPermission && this.hasPermission) {
          this.refresh().catch(this.logger.error);
        }
      });
  }
}
