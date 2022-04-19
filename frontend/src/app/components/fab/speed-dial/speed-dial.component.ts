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

  private touchUntil: number = 0;

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
  anyClick(e: Event) {
    console.log(e);
    if (!this.openManager.isOpen || this.openManager.isAnimating) return;

    this.openManager.close();
  }

  click(e: MouseEvent) {
    console.log(e);
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
