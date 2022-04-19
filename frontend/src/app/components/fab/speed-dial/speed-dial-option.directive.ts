import { Directive, Host, Optional } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: 'speed-dial (button[mat-mini-fab], button[mat-fab])',
})
export class SpeedDialOptionDirective {
  constructor(@Host() @Optional() test?: MatTooltip) {
    if (test) test.position = 'left';
  }
}
