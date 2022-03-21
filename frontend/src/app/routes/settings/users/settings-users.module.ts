import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SettingsUsersEditComponent } from './settings-users-edit/settings-users-edit.component';
import { SettingsUsersComponent } from './settings-users.component';
import { SettingsUsersRoutingModule } from './settings-users.routing.module';

@NgModule({
  declarations: [SettingsUsersComponent, SettingsUsersEditComponent],
  imports: [
    CommonModule,
    SettingsUsersRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
  ],
})
export class SettingsUsersRouteModule {}
