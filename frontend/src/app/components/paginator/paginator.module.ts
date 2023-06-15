import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorComponent } from './paginator.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, PipesModule],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
