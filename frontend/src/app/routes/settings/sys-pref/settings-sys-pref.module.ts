import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsSysprefComponent } from './settings-sys-pref.component';
import { SettingsSysprefRoutingModule } from './settings-sys-pref.routing.module';
import { PrefOptionModule } from '../../../components/pref-option/pref-option.module';
import { I18nModule } from '../../../i18n/i18n.module';

@NgModule({
  declarations: [SettingsSysprefComponent],
  imports: [
    CommonModule,
    I18nModule,
    SettingsSysprefRoutingModule,
    PrefOptionModule,
  ],
})
export default class SettingsSysprefRouteModule {}
