import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PRoutes } from 'src/app/models/picsur-routes';
import { PermissionService } from 'src/app/services/api/permission.service';

@Component({
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
})
export class SettingsSidebarComponent implements OnInit {
  private accessibleRoutes: PRoutes = [];

  personalRoutes: PRoutes = [];
  systemRoutes: PRoutes = [];

  constructor(
    @Inject('SettingsRoutes') private settingsRoutes: PRoutes,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscribePermissions();
  }

  //  @AutoUnsubscribe()
  private subscribePermissions() {
    return this.permissionService.live.subscribe((permissions) => {
      this.accessibleRoutes = this.settingsRoutes
        .filter((route) => route.path !== '')
        .filter((route) =>
          route.data?.permissions !== undefined
            ? route.data?.permissions?.every((permission) =>
                permissions.includes(permission)
              )
            : true
        );

      this.personalRoutes = this.accessibleRoutes.filter(
        (route) => route.data?.page?.category === 'personal'
      );
      this.systemRoutes = this.accessibleRoutes.filter(
        (route) => route.data?.page?.category === 'system'
      );

      if (this.systemRoutes.length === 0 && this.personalRoutes.length === 0) {
        this.router.navigate(['/']);
      }
    });
  }
}
