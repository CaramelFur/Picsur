import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SettingsSidebarComponent } from './settings-sidebar/settings-sidebar.component';
import { SettingsRoutingModule } from './settings.routing.module';

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
export class SettingsRouteModule {
  constructor(private injector: Injector) {}
}
