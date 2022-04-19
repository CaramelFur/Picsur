import { Directive, Host, Optional } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: 'speed-dial button[mat-mini-fab]',
})
export class SpeedDialOptionDirective {
  constructor(
    @Host() @Optional() test?: MatTooltip,
    @Host() @Optional() test2?: MatButton
  ) {
    if (test) test.position = 'left';
    if (test2) test2.color = 'primary';
  }
}
