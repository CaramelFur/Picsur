import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasonryComponent } from './masonry.component';
import { MasonryItemDirective } from './masonry-item.directive';

@NgModule({
  declarations: [MasonryComponent, MasonryItemDirective],
  imports: [CommonModule],
  exports: [MasonryComponent, MasonryItemDirective],
})
export class MasonryModule {}
