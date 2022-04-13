import { Component, Input, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  DecodedSysPref,
  PrefValueType
} from 'picsur-shared/dist/dto/preferences.dto';
import { SysPreference } from 'picsur-shared/dist/dto/syspreferences.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { Subject } from 'rxjs';
import { SysPreferenceFriendlyNames } from 'src/app/i18n/syspref.i18n';
import { Required } from 'src/app/models/decorators/required.decorator';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { SysPrefService } from 'src/app/services/api/syspref.service';
import { Throttle } from 'src/app/util/throttle';
import { UtilService } from 'src/app/util/util.service';

@Component({
  selector: 'pref-option',
  templateUrl: './pref-option.component.html',
  styleUrls: ['./pref-option.component.scss'],
})
export class PrefOptionComponent implements OnInit {
  @Input() @Required pref: DecodedSysPref;
  @Input('update') @Required updateFunction: (
    key: string,
    pref: PrefValueType
  ) => AsyncFailable<any>;

  private updateSubject = new Subject<PrefValueType>();

  constructor(
    private sysprefService: SysPrefService,
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
    const value = (e.target as HTMLInputElement).valueAsNumber;
    if (isNaN(value)) return;

    this.update(value);
  }

  private async updatePreference(value: PrefValueType) {
    const result = await this.updateFunction(this.pref.key, value);
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
      .pipe(Throttle(300))
      .subscribe(this.updatePreference.bind(this));
  }
}
