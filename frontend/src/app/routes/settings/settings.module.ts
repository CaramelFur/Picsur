import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsHomeComponent } from './settings-home/settings-home.component';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { SettingsRoutingModule } from './settings.routing.module';

@NgModule({
  declarations: [SettingsHomeComponent, SettingsSidebarComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatProgressSpinnerModule,

    MatListModule,
    MatIconModule,
  ],
})
export class SettingsRouteModule {}
