import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SettingsUsersEditComponent } from './settings-users-edit/settings-users-edit.component';
import { SettingsUsersComponent } from './settings-users.component';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsUsersComponent,
  },
  {
    path: 'edit/:username',
    component: SettingsUsersEditComponent,
  },
  {
    path: 'add',
    component: SettingsUsersEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsUsersRoutingModule {}
