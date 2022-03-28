import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { ProcessingComponent } from './processing.component';

const routes: PRoutes = [
  {
    path: '',
    component: ProcessingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessingRoutingModule {}
