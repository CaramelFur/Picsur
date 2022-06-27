import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { ImagesComponent } from './images.component';

const routes: PRoutes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '1',
  },
  {
    path: ':page',
    component: ImagesComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [Permission.ImageUpload],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesRoutingModule {}
