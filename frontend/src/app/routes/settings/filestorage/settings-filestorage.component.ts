import { Component } from '@angular/core';
import { SysPreferenceCategory } from 'src/app/i18n/sys-pref.i18n';

@Component({
  templateUrl: './settings-filestorage.component.html',
})
export class SettingsFileStorageComponent {
  public readonly HiddenCategories = Object.values(
    SysPreferenceCategory,
  ).filter((c) => c !== SysPreferenceCategory.FileStorage);
}
