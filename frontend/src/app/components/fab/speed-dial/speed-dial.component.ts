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
  @Input('aria-label') ariaLabel = 'Floating Action Button';

  @Input('icon') icon = 'add';
  @Input('icon-hover') iconHover = 'close';
  @Input('color') color = 'primary';
  @Input('open-on-hover') openOnHover = false;
  @Input('tooltip') tooltip: string;

  @Output('main-click') clickEmitter = new Subject<void>();

  public openManager = new OpenManager();

  private touchUntil = 0;

  @HostListener('document:touchstart', ['$event'])
  @HostListener('document:touchend', ['$event'])
  touchEvent(e: TouchEvent) {
    if (e.type === 'touchstart') {
      this.touchUntil = Infinity;
    } else {
      this.touchUntil = e.timeStamp + 2000;
    }
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:keydown.escape', ['$event'])
  anyClick() {
    if (!this.openManager.isOpen || this.openManager.isAnimating) return;

    this.openManager.close();
  }

  click() {
    if (!this.openManager.isOpen) {
      this.openManager.open();
    } else {
      this.clickEmitter.next();
    }
  }

  enter(e: MouseEvent) {
    if (e.timeStamp <= this.touchUntil) return;

    if (this.openOnHover) {
      this.openManager.open();
    }
  }

  leave(e: MouseEvent) {
    if (e.timeStamp <= this.touchUntil) return;

    if (this.openOnHover) {
      this.openManager.close();
    }
  }
}
