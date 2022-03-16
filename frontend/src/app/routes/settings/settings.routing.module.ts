import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';

const routes: PRoutes = [
  {
    path: 'settings',
    component: SettingsHomeComponent,
    data: {
      sidebar: SettingsSidebarComponent,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
