import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import {
  DecodedPref,
  PrefValueType,
} from 'picsur-shared/dist/dto/preferences.dto';
import { AsyncFailable, HasFailed } from 'picsur-shared/dist/types/failable';
import { filter } from 'rxjs';
import { ZodTypeAny } from 'zod';
import { Required } from '../../models/decorators/required.decorator';
import { Logger } from '../../services/logger/logger.service';
import { ErrorService } from '../../util/error-manager/error.service';
import { Throttle } from '../../util/throttle';

@Component({
  selector: 'pref-option',
  templateUrl: './pref-option.component.html',
  styleUrls: ['./pref-option.component.scss'],
})
export class PrefOptionComponent implements OnInit {
  private readonly logger = new Logger(PrefOptionComponent.name);

  public formControl = new FormControl<any>(undefined, {
    updateOn: 'blur',
    validators: this.syncValidator.bind(this),
  });

  private pref: DecodedPref;
  @Input('pref') set prefSet(pref: DecodedPref) {
    this.pref = pref;
    this.formControl.setValue(pref.value);
  }
  get type() {
    return this.pref.type;
  }

  @Input('update') @Required updateFunction: (
    key: string,
    pref: PrefValueType,
  ) => AsyncFailable<any>;

  @Input() @Required name = '';
  @Input() helpText = '';
  @Input() validator?: ZodTypeAny = undefined;

  constructor(private readonly errorService: ErrorService) {}

  ngOnInit(): void {
    this.subscribeUpdate();
  }

  getErrorMessage() {
    if (this.formControl.errors) {
      const errors = this.formControl.errors;
      if (errors['error']) {
        return errors['error'];
      }
      return 'Invalid value';
    }
    return '';
  }

  private syncValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.validator) return null;

    const result = this.validator.safeParse(control.value);

    if (!result.success) {
      return { error: result.error.issues[0]?.message ?? 'Invalid value' };
    }

    return null;
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
    return this.formControl.valueChanges
      .pipe(
        filter(() => this.formControl.errors === null),
        Throttle(300),
      )
      .subscribe(this.updatePreference.bind(this));
  }
}
