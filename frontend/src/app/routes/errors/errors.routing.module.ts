import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { E401Component } from './401.component';
import { E404Component } from './404.component';

const routes: PRoutes = [
  {
    path: '404',
    component: E404Component,
  },
  {
    path: '401',
    component: E401Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
