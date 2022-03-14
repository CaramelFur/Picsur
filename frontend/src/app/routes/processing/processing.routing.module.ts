import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessingComponent } from './processing.component';

const routes: Routes = [
  {
    path: 'processing',
    component: ProcessingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessingRoutingModule {}
