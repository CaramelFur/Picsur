import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PartialSysPrefModule } from 'src/app/components/partial-sys-pref/partial-sys-pref.module';
import { SettingsFileStorageComponent } from './settings-filestorage.component';
import { SettingsFileStorageRoutingModule } from './settings-filestorage.routing.module';

@NgModule({
  declarations: [SettingsFileStorageComponent],
  imports: [
    CommonModule,
    SettingsFileStorageRoutingModule,
    PartialSysPrefModule,
  ],
})
export default class SettingsFileStorageRouteModule {}
