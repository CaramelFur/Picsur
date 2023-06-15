import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { E401Component } from './401.component';
import { E404Component } from './404.component';
import { ImageDeleteFailureComponent } from './delete-failure.component';
import { ImageDeleteSuccessComponent } from './delete-success.component';
import { PRoutes } from '../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '404',
    component: E404Component,
  },
  {
    path: '401',
    component: E401Component,
  },
  {
    path: 'delete-success',
    component: ImageDeleteSuccessComponent,
  },
  {
    path: 'delete-failure',
    component: ImageDeleteFailureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
