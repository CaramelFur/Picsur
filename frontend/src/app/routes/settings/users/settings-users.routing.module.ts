import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsUsersEditComponent } from './settings-users-edit/settings-users-edit.component';
import { SettingsUsersComponent } from './settings-users.component';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsUsersComponent,
  },
  {
    path: 'edit/:id',
    component: SettingsUsersEditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsUsersRoutingModule {}
