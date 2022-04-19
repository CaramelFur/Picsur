import { Component, HostListener, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { OpenManager } from './open-manager';
import { SpeedDialAnimation } from './speed-dial.animation';

@Component({
  selector: 'speed-dial',
  templateUrl: './speed-dial.component.html',
  animations: [SpeedDialAnimation],
})
export class SpeedDialComponent {
  @Input('aria-label') ariaLabel: string = 'Floating Action Button';

  @Input('icon') icon: string = 'add';
  @Input('icon-hover') iconHover: string = 'close';
  @Input('color') color: string = 'accent';
  @Input('open-on-hover') openOnHover: boolean = false;
  @Input('tooltip') tooltip: string;

  @Output('main-click') clickEmitter = new Subject<void>();

  public openManager = new OpenManager();

  private lastMouseEvent: number = 0;

  @HostListener('document:click', ['$event'])
  anyClick(e: MouseEvent) {
    if (!this.openManager.isOpen) return;
    if (this.lastMouseEvent === e.timeStamp) return;

    this.openManager.close();
  }

  click(e: MouseEvent) {
    if (this.lastMouseEvent === e.timeStamp) return;

    this.lastMouseEvent = e.timeStamp;
    const value = this.openManager.toggle();

    if (value === false) {
      this.clickEmitter.next();
    }
  }

  enter(e: MouseEvent) {
    if (this.openOnHover) {
      this.lastMouseEvent = e.timeStamp;
      this.openManager.open();
    }
  }

  leave(e: MouseEvent) {
    if (this.openOnHover) {
      this.lastMouseEvent = e.timeStamp;
      this.openManager.close();
    }
  }
}
