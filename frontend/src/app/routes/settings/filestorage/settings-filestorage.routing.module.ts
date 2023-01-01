import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SettingsFileStorageComponent } from './settings-filestorage.component';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsFileStorageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsFileStorageRoutingModule {}
