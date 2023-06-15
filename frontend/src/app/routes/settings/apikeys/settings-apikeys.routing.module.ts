import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsApiKeysComponent } from './settings-apikeys.component';
import { PRoutes } from '../../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsApiKeysComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsApiKeysRoutingModule {}
