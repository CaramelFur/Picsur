import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsUsersComponent } from './settings-users.component';
import { SettingsUsersRoutingModule } from './settings-users.routing.module';

@NgModule({
  declarations: [SettingsUsersComponent],
  imports: [
    CommonModule,
    SettingsUsersRoutingModule,
  ],
})
export class SettingsUsersRouteModule {}
