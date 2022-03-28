import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { UploadComponent } from './upload.component';

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
