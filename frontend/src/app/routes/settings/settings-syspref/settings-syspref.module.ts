import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsSysprefComponent } from './settings-syspref.component';
import { SettingsSysprefRoutingModule } from './settings-syspref.routing.module';

@NgModule({
  declarations: [SettingsSysprefComponent],
  imports: [
    CommonModule,
    SettingsSysprefRoutingModule,
  ],
})
export class SettingsSysprefRouteModule {}
