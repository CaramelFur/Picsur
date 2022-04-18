import { Component, Input } from '@angular/core';
import { SpeedDialAnimation } from './speed-dial.animation';

@Component({
  selector: 'speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  animations: [SpeedDialAnimation],
})
export class SpeedDialComponent {
  @Input('aria-label') ariaLabel: string = 'Floating Action Button';

  @Input('icon') icon: string = 'add';
  @Input('icon-hover') iconHover: string | undefined;
  @Input('color') color: string = 'accent';
  @Input('open-on-hover') openOnHover: boolean = true;

  public isOpen = false;

  private isAnimating = true;
  private wantsOpen = false;

  constructor() {}

  click() {
    this.isOpen = !this.isOpen;
  }

  enter() {
    if (this.openOnHover) {
      this.isOpen = true;
    }
  }

  leave() {
    if (this.openOnHover) {
      this.isOpen = false;
    }
  }

  done() {
    console.log('done');
  }
}
