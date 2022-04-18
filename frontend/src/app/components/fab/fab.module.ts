import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FabComponent } from './normal/fab.component';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';

@NgModule({
  declarations: [FabComponent, SpeedDialComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [FabComponent, SpeedDialComponent],
})
export class FabModule {}
