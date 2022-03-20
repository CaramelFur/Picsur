import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CopyFieldComponent } from './copyfield.component';
@NgModule({
  declarations: [CopyFieldComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [CopyFieldComponent],
})
export class CopyFieldModule {}
