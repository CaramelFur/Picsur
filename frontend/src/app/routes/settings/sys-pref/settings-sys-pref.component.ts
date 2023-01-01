import { Component } from '@angular/core';
import { SysPreferenceCategory } from 'src/app/i18n/sys-pref.i18n';

@Component({
  templateUrl: './settings-sys-pref.component.html',
})
export class SettingsSysprefComponent {
  public readonly HiddenCategories = [SysPreferenceCategory.FileStorage];
}
