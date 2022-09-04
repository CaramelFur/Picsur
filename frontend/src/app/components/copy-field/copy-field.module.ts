import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorManagerModule } from 'src/app/util/error-manager/error-manager.module';
import { CopyFieldComponent } from './copy-field.component';
@NgModule({
  declarations: [CopyFieldComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,

    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ClipboardModule,
  ],
  exports: [CopyFieldComponent],
})
export class CopyFieldModule {}
