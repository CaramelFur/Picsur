import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { PermissionService } from 'src/app/services/api/permission.service';

@Component({
  templateUrl: './settings-general.component.html',
})
export class SettingsGeneralComponent implements OnInit {
  constructor(private permissionsService: PermissionService) {}

  ngOnInit(): void {
    this.subscribePermissions();
  }

  @AutoUnsubscribe()
  subscribePermissions() {
    return this.permissionsService.live.subscribe((permissions) => {
      console.log('Pogogog', permissions);
    });
  }
}
