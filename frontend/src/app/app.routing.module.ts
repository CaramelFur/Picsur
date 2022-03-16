import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from './models/picsur-routes';

const routes: PRoutes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      errorHandler: (error) => console.warn(error.message),
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
