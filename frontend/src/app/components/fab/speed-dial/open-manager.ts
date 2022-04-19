export class OpenManager {
  private _isOpen = false;

  private _isAnimating = false;
  private _wantsOpen = false;

  public get isOpen(): boolean {
    return this._isOpen;
  }

  public set isAnimating(val: boolean) {
    this._isAnimating = val;
    if (val === false && this._wantsOpen !== this._isOpen) {
      this._isOpen = this._wantsOpen;
    }
  }

  public get isAnimating(): boolean {
    return this._isAnimating;
  }

  public set wantsOpen(val: boolean) {
    this._wantsOpen = val;
    if (!this._isAnimating) {
      this._isOpen = val;
    }
  }

  public get wantsOpen(): boolean {
    return this._wantsOpen;
  }

  public toggle(): boolean {
    this.wantsOpen = !this.wantsOpen;
    return this.wantsOpen;
  }

  public open(): boolean {
    this.wantsOpen = true;
    return this.wantsOpen;
  }

  public close(): boolean {
    this.wantsOpen = false;
    return this.wantsOpen;
  }

  public animationStart(): void {
    this.isAnimating = true;
  }

  public animationDone(): void {
    this.isAnimating = false;
  }
}
