import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Required } from '../../models/decorators/required.decorator';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  totalPages: number;
  @Input('total-pages') @Required set totalPagesInput(value: number) {
    this.totalPages = value;
    this.calculateRanges();
  }

  page = 1;
  @Input('page') set pageInput(value: number) {
    this.page = value;
    this.calculateRanges();
  }
  @Output('page') pageChange = new EventEmitter<number>();

  @Input('show-first-last') showFirstLast = true;

  @Input('shown-pages') shownPages = 7;
  @Input('shown-first-pages') shownFirstPages = 1;
  @Input('shown-last-pages') shownLastPages = 1;

  firstPagesRange: [number, number] | null = null;
  lastPagesRange: [number, number] | null = null;
  pagesRange: [number, number] = [0, 0];

  ngOnInit(): void {
    this.calculateRanges();
  }

  changePage(page: number) {
    if (page === this.page) return;

    this.pageChange.emit(page);
    this.page = page;
    this.calculateRanges();
  }

  private calculateRanges() {
    if (this.totalPages <= this.shownPages) {
      this.pagesRange = [1, this.totalPages];
      return;
    }

    this.pagesRange = [
      this.page - Math.floor((this.shownPages - 1) / 2),
      this.page + Math.ceil((this.shownPages - 1) / 2),
    ];

    if (this.pagesRange[0] < 1) {
      const offset = 1 - this.pagesRange[0];
      this.pagesRange[0] += offset;
      this.pagesRange[1] += offset;
    }

    if (this.pagesRange[1] > this.totalPages) {
      const offset = this.pagesRange[1] - this.totalPages;
      this.pagesRange[0] -= offset;
      this.pagesRange[1] -= offset;
    }

    if (this.pagesRange[0] > this.shownFirstPages) {
      this.pagesRange[0] += 1 + this.shownFirstPages;
      this.firstPagesRange = [1, this.shownFirstPages];
    } else {
      this.firstPagesRange = null;
    }

    const lastPage = this.totalPages - this.shownLastPages + 1;
    if (this.pagesRange[1] < lastPage) {
      this.pagesRange[1] -= 1 + this.shownLastPages;
      this.lastPagesRange = [lastPage, this.totalPages];
    } else {
      this.lastPagesRange = null;
    }
  }
}
