import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
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

  public isOpen = false;

  private _isAnimating = false;
  private _wantsOpen = false;

  private set isAnimating(val: boolean) {
    this._isAnimating = val;
    if (val === false && this._wantsOpen !== this.isOpen) {
      this.isOpen = this._wantsOpen;
    }
  }

  private set wantsOpen(val: boolean) {
    this._wantsOpen = val;
    if (!this._isAnimating) {
      this.isOpen = val;
    }
  }

  click() {
    if (this._isAnimating) return;

    this.wantsOpen = !this._wantsOpen;

    if (this._wantsOpen === false) {
      this.clickEmitter.next();
    }
  }

  enter() {
    if (this.openOnHover) {
      this.wantsOpen = true;
    }
  }

  leave() {
    if (this.openOnHover) {
      this.wantsOpen = false;
    }
  }

  animStart() {
    this.isAnimating = true;
  }

  animDone() {
    this.isAnimating = false;
  }

  open() {
    this.wantsOpen = true;
  }

  close() {
    this.wantsOpen = false;
  }
}
