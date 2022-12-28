import { Component, Input } from '@angular/core';

@Component({
  selector: 'fab',
  templateUrl: './fab.component.html',
})
export class FabComponent {
  @Input('aria-label') ariaLabel: string = 'Floating Action Button';
  @Input() icon: string = 'add';
  @Input() color: string = 'primary';
  @Input('tooltip') tooltip: string;
  @Input() onClick: () => void = () => {};

  constructor() {}
}
