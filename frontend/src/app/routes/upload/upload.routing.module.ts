import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload.component';
import { PRoutes } from '../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '',
    component: UploadComponent,
    // No permission check here, as that is handled ui friendly in the component itself
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadRoutingModule {}
