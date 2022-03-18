import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsGeneralComponent } from './settings-general.component';

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
