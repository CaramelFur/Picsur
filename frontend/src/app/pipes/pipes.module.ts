import { NgModule } from '@angular/core';
import { RangePipe } from './range.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  declarations: [TruncatePipe, RangePipe],
  exports: [TruncatePipe, RangePipe],
})
export class PipesModule {}
