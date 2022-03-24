import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PRoutes } from 'src/app/models/picsur-routes';
import { ViewComponent } from './view.component';

const routes: PRoutes = [
  {
    path: ':hash',
    component: ViewComponent,
    canActivate: [PermissionGuard],
    data: { permissions: [Permission.ImageView] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule {}
