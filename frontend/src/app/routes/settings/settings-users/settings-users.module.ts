import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SettingsUsersComponent } from './settings-users.component';
import { SettingsUsersRoutingModule } from './settings-users.routing.module';
@NgModule({
  declarations: [SettingsUsersComponent],
  imports: [
    CommonModule,
    SettingsUsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class SettingsUsersRouteModule {}
