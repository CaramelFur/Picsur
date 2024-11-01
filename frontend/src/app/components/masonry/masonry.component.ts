import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { combineLatest, Subscription } from 'rxjs';
import { Throttle } from '../../util/throttle';
import { MasonryItemDirective } from './masonry-item.directive';

@Component({
  selector: 'masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasonryComponent implements AfterViewInit, OnDestroy {
  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  @Input('columns') public set column_count(value: number) {
    this._column_count = value;
    this.cleanAllColumns();
    this.changeDetector.markForCheck();
  }
  public _column_count = 1;
  @Input('update-speed') update_speed = 200;

  @ContentChildren(MasonryItemDirective)
  private items: QueryList<MasonryItemDirective>;

  @ViewChildren('column', { read: ViewContainerRef })
  private columns: QueryList<ViewContainerRef>;

  private sizesSubscription: Subscription | null = null;

  ngAfterViewInit(): void {
    this.subscribeContent();
    this.subscribeColumns();
  }

  @AutoUnsubscribe()
  private subscribeColumns() {
    return this.columns.changes.subscribe(this.handleColumnsChange.bind(this));
  }

  private handleColumnsChange() {
    this.resortItems();
    this.changeDetector.markForCheck();
  }

  @AutoUnsubscribe()
  private subscribeContent() {
    this.handleContentChange();
    return this.items.changes.subscribe(this.handleContentChange.bind(this));
  }

  private handleContentChange() {
    const sizes = this.items.map((i) => i.getSizeObservable());

    if (this.sizesSubscription) {
      this.sizesSubscription.unsubscribe();
    }

    this.sizesSubscription = combineLatest(sizes)
      .pipe(Throttle(this.update_speed))
      .subscribe(() => {
        this.resortItems();
      });

    this.resortItems();

    this.changeDetector.markForCheck();
  }

  private resortItems() {
    const itemsArray = this.items.toArray();

    this.cleanAllColumns();

    const columnsArray = this.columns.map((c) => c);
    const columnSizes = columnsArray.map(() => 0);

    for (let i = 0; i < itemsArray.length; i++) {
      const item = itemsArray[i];

      let smallestColumn = 0;
      let smallestColumnSize = columnSizes[0];
      for (let j = columnSizes.length - 1; j >= 0; j--) {
        const better_j = (j + i) % columnSizes.length;

        if (columnSizes[better_j] <= smallestColumnSize) {
          smallestColumn = better_j;
          smallestColumnSize = columnSizes[better_j];
        }
      }

      columnsArray[smallestColumn].insert(item.getViewRef())
      columnSizes[smallestColumn] +=
        item.getCurrentSize()?.height ?? 0;
    }
  }

  private cleanAllColumns() {
    this.columns?.forEach((column) => {
      this.removeChildren(column);
    });
  }

  private removeChildren(parent: ViewContainerRef) {
    while (parent.length) {
      parent.detach(0);
    }
  }

  ngOnDestroy() {
    if (this.sizesSubscription) {
      this.sizesSubscription.unsubscribe();
    }
  }
}
