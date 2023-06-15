import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CopyFieldComponent } from './copy-field.component';
import { ErrorManagerModule } from '../../util/error-manager/error-manager.module';

@NgModule({
  declarations: [CopyFieldComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,

    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [CopyFieldComponent],
})
export class CopyFieldModule {}
