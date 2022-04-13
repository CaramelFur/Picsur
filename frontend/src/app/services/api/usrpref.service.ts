import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  GetPreferenceResponse,
  MultiplePreferencesResponse,
  UpdatePreferenceRequest,
  UpdatePreferenceResponse
} from 'picsur-shared/dist/dto/api/pref.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import {
  DecodedPref,
  PrefValueType
} from 'picsur-shared/dist/dto/preferences.dto';
import { AsyncFailable, Fail, HasFailed, Map } from 'picsur-shared/dist/types';
import { BehaviorSubject } from 'rxjs';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UtilService } from 'src/app/util/util.service';
import { Logger } from '../logger/logger.service';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class UsrPrefService {
  private readonly logger = new Logger('UsrPrefService');

  private hasPermission = false;

  private usrprefObservable = new BehaviorSubject<DecodedPref[]>([]);

  public get snapshot() {
    return this.usrprefObservable.getValue();
  }

  public get live() {
    return this.usrprefObservable.asObservable();
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
        "Couldn't load user preferences",
        SnackBarType.Error
      );
      this.flush();
    }
  }

  public async getPreferences(): AsyncFailable<DecodedPref[]> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit user preferences');

    const response = await this.api.get(
      MultiplePreferencesResponse,
      '/api/pref/usr'
    );

    return Map(response, (pref) => {
      this.usrprefObservable.next(pref.preferences);
      return pref.preferences;
    });
  }

  public async getPreference(
    key: string
  ): AsyncFailable<GetPreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit user preferences');

    const response = await this.api.get(
      GetPreferenceResponse,
      `/api/pref/usr/${key}`
    );

    if (!HasFailed(response)) this.updatePrefArray(response);
    return response;
  }

  public async setPreference(
    key: string,
    value: PrefValueType
  ): AsyncFailable<UpdatePreferenceResponse> {
    if (!this.hasPermission)
      return Fail('You do not have permission to edit user preferences');

    const response = await this.api.post(
      UpdatePreferenceRequest,
      UpdatePreferenceResponse,
      `/api/pref/usr/${key}`,
      { value }
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
      this.usrprefObservable.next(newArray);
    } else {
      const newArray = [...prefArray];
      newArray[index] = pref;
      this.usrprefObservable.next(newArray);
    }
  }

  private flush() {
    this.usrprefObservable.next([]);
  }

  // We want to flush on logout, because the syspreferences can contain sensitive information
  @AutoUnsubscribe()
  private subscribePermissions() {
    return this.permissionsService.live.subscribe((permissions) => {
      this.hasPermission = permissions.includes(Permission.Settings);
      if (!this.hasPermission) this.flush();
    });
  }
}
