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
import { FabModule } from 'src/app/components/fab/fab.module';
import { ValuesPickerModule } from 'src/app/components/values-picker/values-picker.module';
import { SettingsApiKeysComponent } from './settings-apikeys.component';
import { SettingsApiKeysRoutingModule } from './settings-apikeys.routing.module';

@NgModule({
  declarations: [SettingsApiKeysComponent],
  imports: [
    CommonModule,
    SettingsApiKeysRoutingModule,
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
export class SettingsApiKeysRouteModule {}
