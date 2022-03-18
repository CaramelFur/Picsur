import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PRoutes } from 'src/app/models/picsur-routes';
import { PermissionService } from 'src/app/services/api/permission.service';

@Component({
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
})
export class SettingsSidebarComponent implements OnInit, OnDestroy {
  //private settingsRoutes: PRoutes = [];
  private accessibleRoutes: PRoutes = [];

  personalRoutes: PRoutes = [];
  systemRoutes: PRoutes = [];

  constructor(
    @Inject('SettingsRoutes') private settingsRoutes: PRoutes,
    private permissionService: PermissionService
  ) {}
  ngOnDestroy(): void {
    console.error('destoryed');
  }

  ngOnInit() {
    console.log('SettingsSidebarComponent.ngOnInit() with ' + this.permissionService.counter);
    this.subscribePermissions();
  }

//  @AutoUnsubscribe()
  private subscribePermissions() {
    const o = this.permissionService.live.subscribe((permissions) => {
      console.warn('pog', permissions);
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
    });
    o.add(() => {
      console.error('stopped');
    });
    return o;
  }
}
