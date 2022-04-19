import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FabComponent } from './normal/fab.component';
import { SpeedDialOptionDirective } from './speed-dial/speed-dial-option.directive';
import { SpeedDialComponent } from './speed-dial/speed-dial.component';

@NgModule({
  declarations: [FabComponent, SpeedDialComponent, SpeedDialOptionDirective],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [
    FabComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SpeedDialComponent,
    SpeedDialOptionDirective,
  ],
})
export class FabModule {}
