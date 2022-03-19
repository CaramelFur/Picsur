import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PRoutes } from 'src/app/models/picsur-routes';
import { SidebarResolverService } from 'src/app/services/sidebar-resolver/sidebar-resolver.service';
import { SettingsGeneralRouteModule } from './settings-general/settings-general.module';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { SettingsSysprefRouteModule } from './settings-syspref/settings-syspref.module';
import { SettingsUsersRouteModule } from './settings-users/settings-users.module';

const SettingsRoutes: PRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'general',
      },
      {
        path: 'general',
        loadChildren: () => SettingsGeneralRouteModule,
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
        path: 'system',
        loadChildren: () => SettingsSysprefRouteModule,
        data: {
          permissions: [Permission.SysPrefManage],
          page: {
            title: 'System Settings',
            icon: 'settings',
            category: 'system',
          },
        },
      },
      {
        path: 'users',
        loadChildren: () => SettingsUsersRouteModule,
        data: {
          permissions: [Permission.UserManage],
          page: {
            title: 'Users',
            icon: 'people',
            category: 'system',
          },
        },
      },
    ],
    canActivate: [PermissionGuard],
    canActivateChild: [PermissionGuard],
    data: {
      sidebar: SettingsSidebarComponent,
    },
    resolve: SidebarResolverService.build(),
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
          useFactory: () => SettingsRoutes[0].children,
        },
      ],
    };
  }
}
