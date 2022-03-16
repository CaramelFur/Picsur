import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsGeneralComponent } from './settings-general.component';
import { SettingsGeneralRoutingModule } from './settings-home.routing.module';

@NgModule({
  declarations: [SettingsGeneralComponent],
  imports: [
    CommonModule,
    SettingsGeneralRoutingModule,
  ],
})
export class SettingsGeneralRouteModule {}
