import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SettingsGeneralRouteModule } from './settings-general/settings-home.module';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';

const SettingsRoutes: PRoutes = [
  {
    path: '',
    redirectTo: 'general',
  },
  {
    path: 'general',
    loadChildren: () => SettingsGeneralRouteModule,
    canActivate: [PermissionGuard],
    data: {
      permissions: [Permission.Settings],
      page: {
        title: 'General',
        icon: 'settings',
        category: 'personal',
      },
    },
  },
  {
    path: 'sidebar',
    component: SettingsSidebarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(SettingsRoutes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {
  static forRoot(): ModuleWithProviders<SettingsRoutingModule> {
    return {
      ngModule: SettingsRoutingModule,
      providers: [
        {
          provide: 'SettingsRoutes',
          useFactory: () => SettingsRoutes,
        },
      ],
    };
  }
}
