import { Component } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import { Observable } from 'rxjs';
import { SysPreferenceFriendlyNames } from 'src/app/i18n/sys-pref.i18n';
import { SysPrefService } from 'src/app/services/api/sys-pref.service';

@Component({
  templateUrl: './settings-sys-pref.component.html',
})
export class SettingsSysprefComponent {
  public readonly translator = SysPreferenceFriendlyNames;

  preferences: Observable<DecodedPref[]>;

  constructor(public readonly sysPrefService: SysPrefService) {
    this.preferences = sysPrefService.live;
  }
}
