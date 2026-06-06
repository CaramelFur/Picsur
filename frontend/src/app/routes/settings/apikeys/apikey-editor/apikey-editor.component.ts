import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '../../../../services/logger/logger.service';

@Component({
  selector: 'app-settings-apikey-editor',
  templateUrl: './apikey-editor.component.html',
  styleUrls: ['./apikey-editor.component.scss'],
})
export class SettingsApiKeyEditorComponent {
  private readonly logger = new Logger(SettingsApiKeyEditorComponent.name);

  constructor(private readonly translateService: TranslateService) {}

  @Input() set value(value: string) {
    this.field.setValue(value);
  }

  @Output('changed') change = new EventEmitter<string>();

  field = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(255),
  ]);

  async update() {
    if (this.field.invalid) {
      return;
    }

    const value = this.field.value;
    if (value === null) return;

    this.change.emit(value);
  }

  getErrorMessage() {
    if (this.field.hasError('required')) {
      return this.translateService.instant('settings.apiKeys.errors.required');
    }

    if (this.field.hasError('minlength')) {
      return this.translateService.instant('settings.apiKeys.errors.minLength');
    }

    if (this.field.hasError('maxlength')) {
      return this.translateService.instant('settings.apiKeys.errors.maxLength');
    }

    return this.translateService.instant('settings.apiKeys.errors.unknown');
  }
}
