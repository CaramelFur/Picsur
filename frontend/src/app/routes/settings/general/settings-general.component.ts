import { Component } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import { Observable } from 'rxjs';
import {
  UsrPreferenceFriendlyNames,
  UsrPreferenceHelpText,
} from '../../../i18n/usr-pref.i18n';
import { UsrPrefService } from '../../../services/api/usr-pref.service';

@Component({
  templateUrl: './settings-general.component.html',
})
export class SettingsGeneralComponent {
  private readonly translator = UsrPreferenceFriendlyNames;
  private readonly helpTranslator = UsrPreferenceHelpText;

  public getName(key: string) {
    return (this.translator as any)[key] ?? key;
  }

  public getHelpText(key: string) {
    return (this.helpTranslator as any)[key] ?? '';
  }

  preferences: Observable<DecodedPref[]>;

  constructor(public readonly usrPrefService: UsrPrefService) {
    this.preferences = usrPrefService.live;
  }
}
