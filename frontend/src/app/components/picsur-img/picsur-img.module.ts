import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PicsurImgComponent } from './picsur-img.component';

@NgModule({
  declarations: [PicsurImgComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [PicsurImgComponent],
})
export class PicsurImgModule {}
