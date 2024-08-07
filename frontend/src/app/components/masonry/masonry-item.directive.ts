import { Directive, ElementRef, Inject } from '@angular/core';
import {
  ResizeObserverService,
  WA_RESIZE_OPTION_BOX
} from '@ng-web-apis/resize-observer';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Observable, map } from 'rxjs';

@Directive({
  selector: '[masonry-item]',
  providers: [
    ResizeObserverService,
    {
      provide: WA_RESIZE_OPTION_BOX,
      deps: [ElementRef],
      useValue: "border-box",
    },
  ],
})
export class MasonryItemDirective {
  private lastEntry: ResizeObserverEntry | null = null;

  private resizeObserver: Observable<ResizeObserverEntry>;

  constructor(
    private element: ElementRef<HTMLElement>,
    @Inject(ResizeObserverService)
    resize: Observable<ResizeObserverEntry[]>,
  ) {
    this.resizeObserver = resize.pipe(map((entries) => entries[0]));
    this.subscribeResize();
  }

  @AutoUnsubscribe()
  private subscribeResize() {
    return this.resizeObserver.subscribe((value) => {
      this.lastEntry = value;
    });
  }

  public getElement() {
    return this.element.nativeElement;
  }

  public getSize() {
    return this.resizeObserver;
  }

  public getLastSize() {
    return this.lastEntry;
  }
}
