import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsSysprefOptionComponent } from './settings-syspref-option/settings-syspref-option.component';
import { SettingsSysprefComponent } from './settings-syspref.component';
import { SettingsSysprefRoutingModule } from './settings-syspref.routing.module';

@NgModule({
  declarations: [SettingsSysprefComponent, SettingsSysprefOptionComponent],
  imports: [
    CommonModule,
    SettingsSysprefRoutingModule,
    MatListModule,
    MatSlideToggleModule,
    MatInputModule,
  ],
})
export class SettingsSysprefRouteModule {}
