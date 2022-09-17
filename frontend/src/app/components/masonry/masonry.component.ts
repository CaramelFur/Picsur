import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { combineLatest, Subscription } from 'rxjs';
import { RemoveChildren } from 'src/app/util/remove-children';
import { Throttle } from 'src/app/util/throttle';
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
    this.changeDetector.markForCheck();
  }
  public _column_count = 1;
  @Input('update-speed') update_speed: number = 200;

  @ContentChildren(MasonryItemDirective)
  private content: QueryList<MasonryItemDirective>;

  @ViewChildren('column')
  private columns: QueryList<ElementRef<HTMLDivElement>>;

  private sizesSubscription: Subscription | null = null;

  ngAfterViewInit(): void {
    this.subscribeContent();
  }

  @AutoUnsubscribe()
  private subscribeContent() {
    this.handleContentChange(this.content);
    return this.content.changes.subscribe(this.handleContentChange.bind(this));
  }

  private handleContentChange(items: QueryList<MasonryItemDirective>) {
    const sizes = items.map((i) => i.getSize());

    if (this.sizesSubscription) {
      this.sizesSubscription.unsubscribe();
    }

    this.sizesSubscription = combineLatest(sizes)
      .pipe(Throttle(this.update_speed))
      .subscribe((output) => {
        this.resortItems(items);
      });

    this.resortItems(items);

    this.changeDetector.markForCheck();
  }

  private resortItems(items: QueryList<MasonryItemDirective>) {
    const itemsArray = items.toArray();
    const columnsArray = this.columns.map((c) => c.nativeElement);

    for (let i = 0; i < columnsArray.length; i++) {
      RemoveChildren(columnsArray[i]);
    }

    const columnSizes = columnsArray.map((c) => 0);

    for (let i = 0; i < itemsArray.length; i++) {
      const item = itemsArray[i];

      let smallestColumn = 0;
      let smallestColumnSize = columnSizes[0];
      for (let j = columnSizes.length - 1; j >= 0; j--) {
        let better_j = (j + i) % columnSizes.length;

        if (columnSizes[better_j] <= smallestColumnSize) {
          smallestColumn = better_j;
          smallestColumnSize = columnSizes[better_j];
        }
      }

      columnsArray[smallestColumn].appendChild(item.getElement());
      columnSizes[smallestColumn] +=
        item.getLastSize()?.contentRect.height ?? 0;
    }
  }

  ngOnDestroy() {
    if (this.sizesSubscription) {
      this.sizesSubscription.unsubscribe();
    }
  }
}
