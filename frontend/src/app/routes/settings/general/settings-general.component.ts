import { Component } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import { Observable } from 'rxjs';
import { UsrPrefService } from 'src/app/services/api/usrpref.service';

@Component({
  templateUrl: './settings-general.component.html',
})
export class SettingsGeneralComponent {
  preferences: Observable<DecodedPref[]>;

  constructor(public usrPrefService: UsrPrefService) {
    this.preferences = usrPrefService.live;
  }
}
