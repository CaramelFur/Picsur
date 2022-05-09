import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { MasonryItemDirective } from './masonry-item.directive';

@Component({
  selector: 'masonry',
  templateUrl: './masonry.component.html',
  styleUrls: ['./masonry.component.scss'],
})
export class MasonryComponent implements AfterViewInit {
  @ContentChildren(MasonryItemDirective)
  content: QueryList<MasonryItemDirective>;

  ngAfterViewInit(): void {
    this.subscribeContent();
  }

  @AutoUnsubscribe()
  private subscribeContent() {
    return this.content.changes.subscribe((items) => {
      console.log('a', items.toArray());
    });
  }
}
