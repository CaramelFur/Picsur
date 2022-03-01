import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyFieldComponent } from './copy-field.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [CopyFieldComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  exports: [CopyFieldComponent],
})
export class CopyFieldModule {}
