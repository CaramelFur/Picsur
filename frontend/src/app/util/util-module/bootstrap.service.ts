import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { Observable, map, BehaviorSubject, zip, combineLatest } from 'rxjs';
import { Logger } from 'src/app/services/logger/logger.service';

export enum BSScreenSize {
  xs = 0,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
  xxl = 5,
}

@Injectable({
  providedIn: 'root',
})
export class BootstrapService {
  private readonly logger = new Logger('BootstrapService');

  private smObservable: Observable<boolean>;
  private mdObservable: Observable<boolean>;
  private lgObservable: Observable<boolean>;
  private xlObservable: Observable<boolean>;
  private xxlObservable: Observable<boolean>;

  private screenSizeSubject: BehaviorSubject<BSScreenSize> =
    new BehaviorSubject<BSScreenSize>(BSScreenSize.xs);

  constructor(private breakPointObserver: BreakpointObserver) {
    this.smObservable = this.createObserver('(min-width: 576px)');
    this.mdObservable = this.createObserver('(min-width: 768px)');
    this.lgObservable = this.createObserver('(min-width: 992px)');
    this.xlObservable = this.createObserver('(min-width: 1200px)');
    this.xxlObservable = this.createObserver('(min-width: 1400px)');

    this.subscribeObservables();
  }

  private createObserver(condition: string) {
    return this.breakPointObserver
      .observe([condition])
      .pipe(map((result) => result.matches));
  }

  @AutoUnsubscribe()
  private subscribeObservables() {
    return combineLatest([
      this.smObservable,
      this.mdObservable,
      this.lgObservable,
      this.xlObservable,
      this.xxlObservable,
    ]).subscribe(([sm, md, lg, xl, xxl]) => {
      const size = xxl
        ? BSScreenSize.xxl
        : xl
        ? BSScreenSize.xl
        : lg
        ? BSScreenSize.lg
        : md
        ? BSScreenSize.md
        : sm
        ? BSScreenSize.sm
        : BSScreenSize.xs;

      this.screenSizeSubject.next(size);
    });
  }

  public screenSizeSnapshot(): BSScreenSize {
    return this.screenSizeSubject.value;
  }

  public screenSize(): Observable<BSScreenSize> {
    return this.screenSizeSubject.asObservable();
  }

  public isNotMobile(): Observable<boolean> {
    return this.screenSizeSubject.pipe(map((size) => size > BSScreenSize.xs));
  }

  public isMobile(): Observable<boolean> {
    return this.screenSizeSubject.pipe(map((size) => size <= BSScreenSize.xs));
  }
}
