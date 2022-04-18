import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FabComponent } from './fab.component';

@NgModule({
  declarations: [FabComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [FabComponent],
})
export class FabModule {}
