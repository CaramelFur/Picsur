import { Component, Input, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  DecodedPref,
  PrefValueType,
} from 'picsur-shared/dist/dto/preferences.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types';
import { Subject } from 'rxjs';
import { Required } from 'src/app/models/decorators/required.decorator';
import { Logger } from 'src/app/services/logger/logger.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';
import { Throttle } from 'src/app/util/throttle';

@Component({
  selector: 'pref-option',
  templateUrl: './pref-option.component.html',
  styleUrls: ['./pref-option.component.scss'],
})
export class PrefOptionComponent implements OnInit {
  private readonly logger = new Logger(PrefOptionComponent.name);

  @Input() @Required pref: DecodedPref;
  @Input('update') @Required updateFunction: (
    key: string,
    pref: PrefValueType,
  ) => AsyncFailable<any>;
  @Input() @Required translator: {
    [key in string]: string;
  };

  private updateSubject = new Subject<PrefValueType>();

  constructor(private readonly errorService: ErrorService) {}

  ngOnInit(): void {
    this.subscribeUpdate();
  }

  get name(): string {
    return this.translator[this.pref.key] ?? this.pref.key;
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
      const message =
        this.pref.type === 'string'
          ? `Updated ${this.name}`
          : this.pref.type === 'number'
          ? `Updated ${this.name}`
          : this.pref.type === 'boolean'
          ? value
            ? `Enabled ${this.name}`
            : `Disabled ${this.name}`
          : '';
      this.errorService.success(message);
    } else {
      this.errorService.showFailure(result, this.logger);
    }
  }

  @AutoUnsubscribe()
  subscribeUpdate() {
    return this.updateSubject
      .pipe(Throttle(300))
      .subscribe(this.updatePreference.bind(this));
  }
}
