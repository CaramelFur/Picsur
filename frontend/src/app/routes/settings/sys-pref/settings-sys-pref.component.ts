import { Component } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { map, Observable } from 'rxjs';
import { SysPreferenceUI } from 'src/app/i18n/sys-pref.i18n';

import { makeUnique } from 'picsur-shared/dist/util/unique';
import { SysPrefService } from 'src/app/services/api/sys-pref.service';

@Component({
  templateUrl: './settings-sys-pref.component.html',
  styleUrls: ['./settings-sys-pref.component.scss'],
})
export class SettingsSysprefComponent {
  private readonly syspreferenceUI = SysPreferenceUI;

  public getName(key: string) {
    return this.syspreferenceUI[key as SysPreference]?.name ?? key;
  }

  public getHelpText(key: string) {
    return this.syspreferenceUI[key as SysPreference]?.helpText ?? '';
  }

  public getCategory(key: string): null | string {
    return this.syspreferenceUI[key as SysPreference]?.category ?? null;
  }

  preferences: Observable<Array<{ category: string | null; prefs: DecodedPref[] }>>;

  constructor(public readonly sysPrefService: SysPrefService) {
    this.preferences = sysPrefService.live.pipe(
      map((prefs) => {
        const categories = makeUnique(prefs.map((pref) => this.getCategory(pref.key)));
        return categories.map((category) => ({
          category,
          prefs: prefs.filter((pref) => this.getCategory(pref.key) === category),
        }));
      }),
    )
  }
}
