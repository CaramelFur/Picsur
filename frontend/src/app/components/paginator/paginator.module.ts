import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RangeModule } from '../range/range.module';
import { PaginatorComponent } from './paginator.component';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, RangeModule],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
