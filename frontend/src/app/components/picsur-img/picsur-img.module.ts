import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NguiInviewModule } from '@ngui/common';
import { PicsurImgComponent } from './picsur-img.component';

@NgModule({
  declarations: [PicsurImgComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NguiInviewModule,
  ],
  exports: [PicsurImgComponent],
})
export class PicsurImgModule {}
