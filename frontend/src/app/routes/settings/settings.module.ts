import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ApiModule } from 'src/app/services/api/api.module';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { SettingsRoutingModule } from './settings.routing.module';

@NgModule({
  declarations: [SettingsSidebarComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule.forRoot(),
    ApiModule,
    MatListModule,
    MatIconModule,
  ],
})
export class SettingsRouteModule {}
