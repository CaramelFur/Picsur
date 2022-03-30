import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  GetSyspreferenceResponse,
  MultipleSysPreferencesResponse,
  SysPreferenceBaseResponse,
  UpdateSysPreferenceRequest,
  UpdateSysPreferenceResponse
} from 'picsur-shared/dist/dto/api/pref.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { SysPrefValueType } from 'picsur-shared/dist/dto/syspreferences.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UtilService } from 'src/app/util/util.service';
import { Logger } from '../logger/logger.service';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class SysprefService {
  private readonly logger = new Logger('SysprefService');

  private hasPermission = false;

  private sysprefObservable = new BehaviorSubject<SysPreferenceBaseResponse[]>(
    []
  );

  public get snapshot() {
    return this.sysprefObservable.getValue();
  }

  public get live() {
    return this.sysprefObservable.asObservable();
  }

  constructor(
    private api: ApiService,
    private permissionsService: PermissionService,
    private utilService: UtilService
  ) {
    this.subscribePermissions();
    this.init().catch(this.logger.error);
  }

  private async init() {
    const result = await this.getPreferences();
    if (HasFailed(result)) {
      this.utilService.showSnackBar(
        "Couldn't load system preferences",
        SnackBarType.Error
      );
      this.flush();
    }
  }

  public async getPreferences(): AsyncFailable<SysPreferenceBaseResponse[]> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.get(
      MultipleSysPreferencesResponse,
      '/api/pref/sys'
    );
    if (HasFailed(response)) return response;

    this.sysprefObservable.next(response.preferences);
    return response.preferences;
  }

  public async getPreference(
    key: string
  ): AsyncFailable<GetSyspreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.get(
      GetSyspreferenceResponse,
      `/api/pref/sys/${key}`
    );

    if (!HasFailed(response)) this.updatePrefArray(response);
    return response;
  }

  public async setPreference(
    key: string,
    value: SysPrefValueType
  ): AsyncFailable<UpdateSysPreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit system preferences');

    const response = await this.api.post(
      UpdateSysPreferenceRequest,
      UpdateSysPreferenceResponse,
      `/api/pref/sys/${key}`,
      { value }
    );

    if (!HasFailed(response)) this.updatePrefArray(response);
    return response;
  }

  private updatePrefArray(pref: SysPreferenceBaseResponse) {
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
    return this.permissionsService.live.subscribe((permissions) => {
      this.hasPermission = permissions.includes(Permission.SysPrefManage);
      if (!this.hasPermission) {
        this.flush();
      }
    });
  }
}
