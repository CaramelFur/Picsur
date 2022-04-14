import { Component } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import { Observable } from 'rxjs';
import { SysPreferenceFriendlyNames } from 'src/app/i18n/syspref.i18n';
import { SysPrefService } from 'src/app/services/api/syspref.service';

@Component({
  templateUrl: './settings-syspref.component.html',
})
export class SettingsSysprefComponent {
  public translator = SysPreferenceFriendlyNames;

  preferences: Observable<DecodedPref[]>;

  constructor(public sysPrefService: SysPrefService) {
    this.preferences = sysPrefService.live;
  }
}
