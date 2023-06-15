import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { PRoutes } from '../../../models/dto/picsur-routes.dto';
import { PermissionService } from '../../../services/api/permission.service';

@Component({
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
})
export class SettingsSidebarComponent implements OnInit {
  private accessibleRoutes: PRoutes = [];

  personalRoutes: PRoutes = [];
  systemRoutes: PRoutes = [];

  constructor(
    @Inject('SettingsRoutes') private readonly settingsRoutes: PRoutes,
    private readonly permissionService: PermissionService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.subscribePermissions();
  }

  private handlePermissions(permissions: string[]) {
    // Filter all routes to the routes the current user can access
    this.accessibleRoutes = this.settingsRoutes
      .filter((route) => route.path !== '')
      .filter((route) =>
        route.data?.permissions !== undefined
          ? route.data?.permissions?.every((permission) =>
              permissions.includes(permission),
            )
          : true,
      );

    // Split them according to their groups
    this.personalRoutes = this.accessibleRoutes.filter(
      (route) => route.data?.page?.category === 'personal',
    );
    this.systemRoutes = this.accessibleRoutes.filter(
      (route) => route.data?.page?.category === 'system',
    );

    // Get out of here if we have no routes
    if (this.systemRoutes.length === 0 && this.personalRoutes.length === 0) {
      this.router.navigate(['/']);
    }
  }

  @AutoUnsubscribe()
  private subscribePermissions() {
    return this.permissionService.live.subscribe(
      this.handlePermissions.bind(this),
    );
  }
}
