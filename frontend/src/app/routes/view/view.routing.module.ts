import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { ViewComponent } from './view.component';

const routes: Routes = [
  {
    path: 'view/:hash',
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
