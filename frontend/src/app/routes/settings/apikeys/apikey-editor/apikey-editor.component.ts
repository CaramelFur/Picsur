import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Logger } from '../../../../services/logger/logger.service';

@Component({
  selector: 'app-settings-apikey-editor',
  templateUrl: './apikey-editor.component.html',
  styleUrls: ['./apikey-editor.component.scss'],
})
export class SettingsApiKeyEditorComponent {
  private readonly logger = new Logger(SettingsApiKeyEditorComponent.name);

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
      return 'You must enter a value';
    }

    if (this.field.hasError('minlength')) {
      return 'Minimum length is 3';
    }

    if (this.field.hasError('maxlength')) {
      return 'Maximum length is 255';
    }

    return 'Unknown error';
  }
}
