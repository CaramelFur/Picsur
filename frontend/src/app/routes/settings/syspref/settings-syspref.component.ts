import { Component } from '@angular/core';
import { SysPreferenceBaseResponse } from 'picsur-shared/dist/dto/api/pref.dto';
import { Subject } from 'rxjs';
import { SysprefService as SysPrefService } from 'src/app/services/api/syspref.service';

@Component({
  templateUrl: './settings-syspref.component.html',
})
export class SettingsSysprefComponent {
  preferences: Subject<SysPreferenceBaseResponse[]>;

  constructor(sysprefService: SysPrefService) {
    this.preferences = sysprefService.live;
  }
}
