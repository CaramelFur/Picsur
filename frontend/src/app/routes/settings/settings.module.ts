import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SettingsRoutingModule } from './settings.routing.module';
import { SettingsSidebarComponent } from './sidebar/settings-sidebar.component';

@NgModule({
  declarations: [SettingsSidebarComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule.forRoot(),
    MatListModule,
    MatIconModule,
  ],
  exports: [SettingsRoutingModule],
})
export default class SettingsRouteModule {}
