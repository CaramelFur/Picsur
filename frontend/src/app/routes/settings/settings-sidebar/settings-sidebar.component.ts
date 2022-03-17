import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { PRoutes } from 'src/app/models/picsur-routes';
import { PermissionService } from 'src/app/services/api/permission.service';

@Component({
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.scss'],
})
export class SettingsSidebarComponent implements OnInit {
  private accessibleRoutes: PRoutes = [];
  private settingsRoutes: PRoutes = [];

  personalRoutes: PRoutes = [];
  systemRoutes: PRoutes = [];

  constructor(
    /* @Inject('SettingsRoutes')*/
    private permissionService: PermissionService,
    private router: Router
  ) {
    console.error("contstruct");
    console.log('stat', this.router.getCurrentNavigation());
  }

  ngOnInit() {
    console.log('SettingsSidebarComponent.ngOnInit()');
    this.subscribePermissions();


  }

  @AutoUnsubscribe()
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
    });
  }
}
