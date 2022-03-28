import { Component, Input, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SysPreferenceBaseResponse } from 'picsur-shared/dist/dto/api/pref.dto';
import {
  SysPreference,
  SysPrefValueType
} from 'picsur-shared/dist/dto/syspreferences.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { Subject, throttleTime } from 'rxjs';
import { SysPreferenceFriendlyNames } from 'src/app/i18n/syspref.i18n';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { SysprefService } from 'src/app/services/api/syspref.service';
import { UtilService } from 'src/app/util/util.service';

@Component({
  selector: 'syspref-option',
  templateUrl: './settings-syspref-option.component.html',
  styleUrls: ['./settings-syspref-option.component.scss'],
})
export class SettingsSysprefOptionComponent implements OnInit {
  @Input() pref: SysPreferenceBaseResponse;

  private updateSubject = new Subject<SysPrefValueType>();

  constructor(
    private sysprefService: SysprefService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.subscribeUpdate();
  }

  get name(): string {
    return (
      SysPreferenceFriendlyNames[this.pref.key as SysPreference] ??
      this.pref.key
    );
  }

  get valString(): string {
    if (this.pref.type !== 'string') {
      throw new Error('Not a string preference');
    }
    return this.pref.value as string;
  }

  get valNumber(): number {
    if (this.pref.type !== 'number') {
      throw new Error('Not an int preference');
    }
    return this.pref.value as number;
  }

  get valBool(): boolean {
    if (this.pref.type !== 'boolean') {
      throw new Error('Not a boolean preference');
    }
    return this.pref.value as boolean;
  }

  update(value: any) {
    this.updateSubject.next(value);
  }

  stringUpdateWrapper(e: Event) {
    this.update((e.target as HTMLInputElement).value);
  }

  numberUpdateWrapper(e: Event) {
    this.update((e.target as HTMLInputElement).valueAsNumber);
  }

  private async updatePreference(value: SysPrefValueType) {
    const result = await this.sysprefService.setPreference(
      this.pref.key,
      value
    );
    if (!HasFailed(result)) {
      this.utilService.showSnackBar(
        `Updated ${this.name}`,
        SnackBarType.Success
      );
    } else {
      this.utilService.showSnackBar(
        `Failed to update ${this.name}`,
        SnackBarType.Error
      );
    }
  }

  @AutoUnsubscribe()
  subscribeUpdate() {
    return this.updateSubject
      .pipe(throttleTime(300, undefined, { leading: true, trailing: true }))
      .subscribe(this.updatePreference.bind(this));
  }
}
