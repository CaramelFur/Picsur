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
import { SettingsUsersEditComponent } from './settings-users-edit/settings-users-edit.component';
import { SettingsUsersComponent } from './settings-users.component';
import { SettingsUsersRoutingModule } from './settings-users.routing.module';
import { FabModule } from '../../../components/fab/fab.module';
import { ValuesPickerModule } from '../../../components/values-picker/values-picker.module';
import { DialogManagerModule } from '../../../util/dialog-manager/dialog-manager.module';
import { ErrorManagerModule } from '../../../util/error-manager/error-manager.module';

@NgModule({
  declarations: [SettingsUsersComponent, SettingsUsersEditComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,
    DialogManagerModule,

    SettingsUsersRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    FormsModule,
    FabModule,
    ReactiveFormsModule,
    ValuesPickerModule,
  ],
})
export default class SettingsUsersRouteModule {}
