import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  GetPreferenceResponse,
  MultiplePreferencesResponse,
  UpdatePreferenceRequest,
  UpdatePreferenceResponse,
} from 'picsur-shared/dist/dto/api/pref.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import {
  DecodedPref,
  PrefValueType,
} from 'picsur-shared/dist/dto/preferences.dto';
import {
  AsyncFailable,
  FT,
  Fail,
  HasFailed,
  Map,
} from 'picsur-shared/dist/types/failable';
import { BehaviorSubject } from 'rxjs';
import { ErrorService } from '../../util/error-manager/error.service';
import { Throttle } from '../../util/throttle';
import { Logger } from '../logger/logger.service';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class UsrPrefService {
  private readonly logger = new Logger(UsrPrefService.name);

  private hasPermission = false;

  private usrprefObservable = new BehaviorSubject<DecodedPref[]>([]);

  public get snapshot() {
    return this.usrprefObservable.getValue();
  }

  public get live() {
    return this.usrprefObservable.asObservable();
  }

  constructor(
    private readonly api: ApiService,
    private readonly permissionsService: PermissionService,
    private readonly errorService: ErrorService,
  ) {
    this.subscribePermissions();
  }

  private async refresh() {
    const result = await this.getPreferences();
    if (HasFailed(result)) {
      this.errorService.showFailure(result, this.logger);
      this.flush();
    }
  }

  public async getPreferences(): AsyncFailable<DecodedPref[]> {
    if (!this.hasPermission)
      return Fail(
        FT.Permission,
        'You do not have permission to edit user preferences',
      );

    const response = await this.api.get(
      MultiplePreferencesResponse,
      '/api/pref/usr',
    ).result;

    return Map(response, (pref) => {
      this.usrprefObservable.next(pref.results);
      return pref.results;
    });
  }

  public async getPreference(
    key: string,
  ): AsyncFailable<GetPreferenceResponse> {
    if (!this.hasPermission)
      return Fail(
        FT.Permission,
        'You do not have permission to edit user preferences',
      );

    const response = await this.api.get(
      GetPreferenceResponse,
      `/api/pref/usr/${key}`,
    ).result;

    if (!HasFailed(response)) this.updatePrefArray(response);
    return response;
  }

  public async setPreference(
    key: string,
    value: PrefValueType,
  ): AsyncFailable<UpdatePreferenceResponse> {
    if (!this.hasPermission)
      return Fail(
        FT.Permission,
        'You do not have permission to edit user preferences',
      );

    const response = await this.api.post(
      UpdatePreferenceRequest,
      UpdatePreferenceResponse,
      `/api/pref/usr/${key}`,
      { value },
    ).result;

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
    return this.permissionsService.live
      .pipe(Throttle(300))
      .subscribe((permissions) => {
        this.hasPermission = permissions.includes(Permission.Settings);
        if (!this.hasPermission) this.flush();
        else this.refresh().catch(this.logger.error);
      });
  }
}
