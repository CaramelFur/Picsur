import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PartialSysPrefModule } from 'src/app/components/partial-sys-pref/partial-sys-pref.module';
import { SettingsSysprefComponent } from './settings-sys-pref.component';
import { SettingsSysprefRoutingModule } from './settings-sys-pref.routing.module';

@NgModule({
  declarations: [SettingsSysprefComponent],
  imports: [CommonModule, SettingsSysprefRoutingModule, PartialSysPrefModule],
})
export default class SettingsSysprefRouteModule {}
