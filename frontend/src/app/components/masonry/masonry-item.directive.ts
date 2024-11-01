import { Directive, TemplateRef, ViewRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: 'ng-template[masonry-item]',
})
export class MasonryItemDirective {
  private viewRef: ViewRef | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private sizeSubject: BehaviorSubject<{ width: number; height: number }> =
    new BehaviorSubject({ width: 0, height: 0 });

  constructor(private template: TemplateRef<HTMLElement>) {}

  public getTemplate(): TemplateRef<HTMLElement> {
    return this.template;
  }

  public getViewRef(): ViewRef {
    if (!this.viewRef || this.viewRef.destroyed) {
      this.viewRef = this.template.createEmbeddedView(null as any);
      this.resubscribeResizeObserver();
    }
    return this.viewRef;
  }

  public getElement(): HTMLElement | null {
    const anyRef = this.getViewRef() as any;
    return anyRef.rootNodes.length > 0 ? anyRef.rootNodes[0] : null;
  }

  public getSizeObservable() {
    return this.sizeSubject.asObservable();
  }

  public getCurrentSize() {
    return this.sizeSubject.value;
  }

  public resubscribeResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    const element = this.getElement();
    if (element) {
      this.resizeObserver = new ResizeObserver((items) => {
        const { width, height } = items[0].contentRect;
        this.sizeSubject.next({ width, height });
      });
      this.resizeObserver.observe(element);
    }
  }
}
