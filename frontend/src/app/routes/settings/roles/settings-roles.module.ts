import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsRolesComponent } from './settings-roles.component';
import { SettingsRolesRoutingModule } from './settings-roles.routing.module';

@NgModule({
  declarations: [SettingsRolesComponent],
  imports: [
    CommonModule,
    SettingsRolesRoutingModule,
  ],
})
export class SettingsRolesRouteModule {}
