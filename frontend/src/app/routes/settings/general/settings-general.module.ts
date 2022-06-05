import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrefOptionModule } from 'src/app/components/pref-option/pref-option.module';
import { SettingsGeneralComponent } from './settings-general.component';
import { SettingsGeneralRoutingModule } from './settings-general.routing.module';

@NgModule({
  declarations: [SettingsGeneralComponent],
  imports: [CommonModule, SettingsGeneralRoutingModule, PrefOptionModule],
})
export class SettingsGeneralRouteModule {}
