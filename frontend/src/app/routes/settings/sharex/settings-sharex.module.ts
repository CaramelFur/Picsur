import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsShareXComponent } from './settings-sharex.component';
import { SettingsShareXRoutingModule } from './settings-sharex.routing.module';

@NgModule({
  declarations: [SettingsShareXComponent],
  imports: [
    CommonModule,
    SettingsShareXRoutingModule,
  ],
})
export class SettingsShareXRouteModule {}
