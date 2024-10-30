import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectInfiniteScrollDirective } from './infinite-select.directive';


@NgModule({
  declarations: [MatSelectInfiniteScrollDirective],
  imports: [
    MatSelectModule,
  ],
  exports: [MatSelectInfiniteScrollDirective],
})
export default class MatSelectInfiniteScrollModule {}
