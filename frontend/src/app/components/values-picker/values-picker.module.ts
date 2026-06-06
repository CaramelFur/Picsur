import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { I18nModule } from '../../i18n/i18n.module';
import { ValuesPickerComponent } from './values-picker.component';

@NgModule({
  declarations: [ValuesPickerComponent],
  imports: [
    CommonModule,
    I18nModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ValuesPickerComponent],
})
export class ValuesPickerModule {}
