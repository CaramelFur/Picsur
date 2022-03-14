import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './pagenotfound.component';
import { PageNotFoundRoutingModule } from './processing.routing.module';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, PageNotFoundRoutingModule],
})
export class PageNotFoundRouteModule {}
