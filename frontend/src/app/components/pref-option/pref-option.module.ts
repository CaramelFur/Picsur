import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErrorManagerModule } from 'src/app/util/error-manager/error-manager.module';
import { PrefOptionComponent } from './pref-option.component';

@NgModule({
  imports: [
    CommonModule,
    ErrorManagerModule,

    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
  declarations: [PrefOptionComponent],
  exports: [PrefOptionComponent],
})
export class PrefOptionModule {}
