import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsUsersComponent } from './settings-users.component';

const routes: PRoutes = [
  {
    path: '',
    component: SettingsUsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsUsersRoutingModule {}
