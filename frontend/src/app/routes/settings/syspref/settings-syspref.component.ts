import { Component } from '@angular/core';
import { DecodedPref } from 'picsur-shared/dist/dto/preferences.dto';
import { Observable } from 'rxjs';
import { SysPrefService } from 'src/app/services/api/syspref.service';

@Component({
  templateUrl: './settings-syspref.component.html',
})
export class SettingsSysprefComponent {
  preferences: Observable<DecodedPref[]>;

  constructor(public sysPrefService: SysPrefService) {
    this.preferences = sysPrefService.live;
  }
}
