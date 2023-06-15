import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { FabModule } from '../../../components/fab/fab.module';
import { ValuesPickerModule } from '../../../components/values-picker/values-picker.module';
import { DialogManagerModule } from '../../../util/dialog-manager/dialog-manager.module';
import { ErrorManagerModule } from '../../../util/error-manager/error-manager.module';
import { SettingsRolesEditComponent } from './settings-roles-edit/settings-roles-edit.component';
import { SettingsRolesComponent } from './settings-roles.component';
import { SettingsRolesRoutingModule } from './settings-roles.routing.module';

@NgModule({
  declarations: [SettingsRolesComponent, SettingsRolesEditComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,
    DialogManagerModule,

    SettingsRolesRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FabModule,
    ReactiveFormsModule,
    ValuesPickerModule,
  ],
})
export default class SettingsRolesRouteModule {}
