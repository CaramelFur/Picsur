import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PRoutes } from 'src/app/models/dto/picsur-routes.dto';
import { SidebarResolverService } from 'src/app/services/sidebar-resolver/sidebar-resolver.service';
import { SettingsGeneralRouteModule } from './general/settings-general.module';
import { SettingsRolesRouteModule } from './roles/settings-roles.module';
import { SettingsSidebarComponent } from './sidebar/settings-sidebar.component';
import { SettingsSysprefRouteModule } from './sys-pref/settings-sys-pref.module';
import { SettingsUsersRouteModule } from './users/settings-users.module';

const SettingsRoutes: PRoutes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
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
        path: 'users',
        loadChildren: () => SettingsUsersRouteModule,
        data: {
          permissions: [Permission.UserAdmin],
          page: {
            title: 'Users',
            icon: 'people_outline',
            category: 'system',
          },
        },
      },
      {
        path: 'roles',
        loadChildren: () => SettingsRolesRouteModule,
        data: {
          permissions: [Permission.RoleAdmin],
          page: {
            title: 'Roles',
            icon: 'admin_panel_settings',
            category: 'system',
          },
        },
      },
      {
        path: 'system',
        loadChildren: () => SettingsSysprefRouteModule,
        data: {
          permissions: [Permission.SysPrefAdmin],
          page: {
            title: 'System Settings',
            icon: 'tune',
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
