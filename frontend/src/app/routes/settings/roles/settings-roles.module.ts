import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SettingsRolesComponent } from './settings-roles.component';
import { SettingsRolesRoutingModule } from './settings-roles.routing.module';

@NgModule({
  declarations: [SettingsRolesComponent],
  imports: [
    CommonModule,
    SettingsRolesRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
  ],
})
export class SettingsRolesRouteModule {}
