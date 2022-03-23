import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsRolesComponent } from './settings-roles.component';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsRolesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRolesRoutingModule {}
