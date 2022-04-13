import { Component } from '@angular/core';
import { DecodedSysPref } from 'picsur-shared/dist/dto/preferences.dto';
import { Observable } from 'rxjs';
import { SysPrefService } from 'src/app/services/api/syspref.service';

@Component({
  templateUrl: './settings-syspref.component.html',
})
export class SettingsSysprefComponent {
  preferences: Observable<DecodedSysPref[]>;

  constructor(sysprefService: SysPrefService) {
    this.preferences = sysprefService.live;
  }
}
