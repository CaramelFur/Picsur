import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrefOptionComponent } from './pref-option.component';
import { ErrorManagerModule } from '../../util/error-manager/error-manager.module';

@NgModule({
  imports: [
    CommonModule,
    ErrorManagerModule,

    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  declarations: [PrefOptionComponent],
  exports: [PrefOptionComponent],
})
export class PrefOptionModule {}
