import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsRolesEditComponent } from './settings-roles-edit/settings-roles-edit.component';
import { SettingsRolesComponent } from './settings-roles.component';
import { PRoutes } from '../../../models/dto/picsur-routes.dto';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsRolesComponent,
  },
  {
    path: 'edit/:role',
    component: SettingsRolesEditComponent,
  },
  {
    path: 'add',
    component: SettingsRolesEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRolesRoutingModule {}
