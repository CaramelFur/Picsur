import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MomentModule } from 'ngx-moment';
import { FabModule } from 'src/app/components/fab/fab.module';
import { DialogManagerModule } from 'src/app/util/dialog-manager/dialog-manager.module';
import { ErrorManagerModule } from 'src/app/util/error-manager/error-manager.module';
import { SettingsApiKeyEditorComponent } from './apikey-editor/apikey-editor.component';
import { SettingsApiKeysComponent } from './settings-apikeys.component';
import { SettingsApiKeysRoutingModule } from './settings-apikeys.routing.module';

@NgModule({
  declarations: [SettingsApiKeysComponent, SettingsApiKeyEditorComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,
    DialogManagerModule,

    SettingsApiKeysRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MomentModule,
    ClipboardModule,
    ReactiveFormsModule,
    FabModule,
  ],
})
export class SettingsApiKeysRouteModule {}
