import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsGeneralRouteModule } from './settings-general/settings-home.module';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';

const SettingsRoutes: PRoutes = [
  {
    path: '',
    loadChildren: () => SettingsGeneralRouteModule,
    data: {
      sidebar: SettingsSidebarComponent,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(SettingsRoutes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
