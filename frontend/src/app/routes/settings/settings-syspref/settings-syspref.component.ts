import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SysPreferenceResponse } from 'picsur-shared/dist/dto/api/pref.dto';
import { SysprefService as SysPrefService } from 'src/app/services/api/syspref.service';

@Component({
  templateUrl: './settings-syspref.component.html',
})
export class SettingsSysprefComponent implements OnInit {
  render = true;
  preferences: SysPreferenceResponse[] = [];

  constructor(private sysprefService: SysPrefService) {}

  async ngOnInit() {
    this.subscribePreferences();
    await this.sysprefService.getPreferences();
  }

  @AutoUnsubscribe()
  private subscribePreferences() {
    return this.sysprefService.live.subscribe((preferences) => {
      // If the preferences are the same, something probably went wrong, so reset
      if (this.compareFlatObjectArray(this.preferences, preferences)) {
        this.render = false;
        setTimeout(() => {
          this.render = true;
        });
      }

      this.preferences = preferences;
    });
  }

  private compareFlatObjectArray(a: any[], b: any[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!this.compareFlatObject(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  private compareFlatObject(a: any, b: any): boolean {
    for (const key in a) {
      if (a.hasOwnProperty(key) && a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }
}
