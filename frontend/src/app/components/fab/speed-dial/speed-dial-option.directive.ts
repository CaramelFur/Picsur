import { Directive, Host, Optional } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: 'speed-dial button[mat-mini-fab]',
})
export class SpeedDialOptionDirective {
  constructor(
    @Host() @Optional() tooltip?: MatTooltip,
    @Host() @Optional() button?: MatMiniFabButton,
  ) {
    if (tooltip) tooltip.position = 'left';
    if (button) button.color = 'accent';
  }
}
