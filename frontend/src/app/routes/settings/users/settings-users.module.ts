import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SettingsUsersComponent } from './settings-users.component';
import { SettingsUsersRoutingModule } from './settings-users.routing.module';
@NgModule({
  declarations: [SettingsUsersComponent],
  imports: [
    CommonModule,
    SettingsUsersRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class SettingsUsersRouteModule {}
