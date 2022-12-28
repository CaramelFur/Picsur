import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrefOptionModule } from 'src/app/components/pref-option/pref-option.module';
import { SettingsSysprefComponent } from './settings-sys-pref.component';
import { SettingsSysprefRoutingModule } from './settings-sys-pref.routing.module';

@NgModule({
  declarations: [SettingsSysprefComponent],
  imports: [CommonModule, SettingsSysprefRoutingModule, PrefOptionModule],
})
export default class SettingsSysprefRouteModule {}
