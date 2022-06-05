import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SettingsRolesEditComponent } from './settings-roles-edit/settings-roles-edit.component';
import { SettingsRolesComponent } from './settings-roles.component';

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
