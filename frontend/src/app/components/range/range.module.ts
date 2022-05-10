import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RangePipe } from './range.pipe';

@NgModule({
  declarations: [RangePipe],
  imports: [CommonModule],
  exports: [RangePipe],
})
export class RangeModule {}
