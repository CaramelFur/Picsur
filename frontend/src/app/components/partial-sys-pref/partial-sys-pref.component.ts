import { Component, Input } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import {
  SysPreference,
  SysPreferenceValidators
} from 'picsur-shared/dist/dto/sys-preferences.enum';
import { map, Observable } from 'rxjs';
import {
  SysPreferenceCategories,
  SysPreferenceCategory,
  SysPreferenceUI
} from 'src/app/i18n/sys-pref.i18n';

import { SysPrefService } from 'src/app/services/api/sys-pref.service';
import { z, ZodTypeAny } from 'zod';

@Component({
  selector: 'partial-sys-pref',
  templateUrl: './partial-sys-pref.component.html',
})
export class PartialSysPrefComponent {
  @Input('hidden-categories') public set hiddenCategories(
    value: SysPreferenceCategory[],
  ) {
    this.categories = this.makeCategories(value);
  }

  @Input("show-titles") public showTitles = true;

  private categories = this.makeCategories();

  public getName(key: string) {
    return SysPreferenceUI[key as SysPreference]?.name ?? key;
  }

  public getHelpText(key: string) {
    return SysPreferenceUI[key as SysPreference]?.helpText ?? '';
  }

  public getCategory(key: string): null | string {
    return SysPreferenceUI[key as SysPreference]?.category ?? null;
  }

  public getValidator(key: string): ZodTypeAny {
    return SysPreferenceValidators[key as SysPreference] ?? z.any();
  }

  preferences: Observable<
    Array<{
      category: string;
      title: string;
      prefs: DecodedPref[];
    }>
  >;

  constructor(public readonly sysPrefService: SysPrefService) {
    this.preferences = sysPrefService.live.pipe(
      map((prefs) => {
        return this.categories.map((category) => ({
          category,
          title: SysPreferenceCategories[category],
          prefs: prefs.filter(
            (pref) => this.getCategory(pref.key) === category,
          ),
        }));
      }),
    );
  }

  private makeCategories(hiddenCategories: SysPreferenceCategory[] = []) {
    return Object.values(SysPreferenceCategory).filter(
      (category) => !hiddenCategories.includes(category),
    );
  }
}
