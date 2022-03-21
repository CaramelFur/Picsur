import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsSysprefComponent } from './settings-syspref.component';
import { SettingsSysprefRoutingModule } from './settings-syspref.routing.module';
import { SettingsSysprefOptionComponent } from './syspref-option/settings-syspref-option.component';

@NgModule({
  declarations: [SettingsSysprefComponent, SettingsSysprefOptionComponent],
  imports: [
    CommonModule,
    SettingsSysprefRoutingModule,
    MatSlideToggleModule,
    MatInputModule,
  ],
})
export class SettingsSysprefRouteModule {}
