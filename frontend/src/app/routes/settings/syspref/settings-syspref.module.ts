import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrefOptionModule } from 'src/app/components/pref-option/pref-option.module';
import { SettingsSysprefComponent } from './settings-syspref.component';
import { SettingsSysprefRoutingModule } from './settings-syspref.routing.module';

@NgModule({
  declarations: [SettingsSysprefComponent],
  imports: [
    CommonModule,
    SettingsSysprefRoutingModule,
    PrefOptionModule,
  ],
})
export class SettingsSysprefRouteModule {}
