import { Component } from '@angular/core';
import { SysPreferenceBaseResponse } from 'picsur-shared/dist/dto/api/syspref.dto';
import { Observable } from 'rxjs';
import { SysprefService as SysPrefService } from 'src/app/services/api/syspref.service';

@Component({
  templateUrl: './settings-syspref.component.html',
})
export class SettingsSysprefComponent {
  preferences: Observable<SysPreferenceBaseResponse[]>;

  constructor(sysprefService: SysPrefService) {
    this.preferences = sysprefService.live;
  }
}
