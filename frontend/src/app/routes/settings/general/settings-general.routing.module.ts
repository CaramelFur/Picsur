import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsGeneralComponent } from './settings-general.component';
import { PRoutes } from '../../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsGeneralComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsGeneralRoutingModule {}
