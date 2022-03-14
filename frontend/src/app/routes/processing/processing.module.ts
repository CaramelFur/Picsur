import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProcessingComponent } from './processing.component';
import { ProcessingRoutingModule } from './processing.routing.module';

@NgModule({
  declarations: [ProcessingComponent],
  imports: [
    CommonModule,
    ProcessingRoutingModule,
    MatProgressSpinnerModule,
  ],
})
export class ProcessingRouteModule {}
