import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsGeneralComponent } from './settings-general.component';
import { SettingsGeneralRoutingModule } from './settings-general.routing.module';
import { PrefOptionModule } from '../../../components/pref-option/pref-option.module';

@NgModule({
  declarations: [SettingsGeneralComponent],
  imports: [CommonModule, SettingsGeneralRoutingModule, PrefOptionModule],
})
export default class SettingsGeneralRouteModule {}
