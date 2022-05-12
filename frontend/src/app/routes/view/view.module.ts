import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MomentModule } from 'ngx-moment';
import { CopyFieldModule } from 'src/app/components/copy-field/copy-field.module';
import { FabModule } from 'src/app/components/fab/fab.module';
import { PicsurImgModule } from 'src/app/components/picsur-img/picsur-img.module';
import { CustomizeDialogComponent } from './customize-dialog/customize-dialog.component';
import { ViewComponent } from './view.component';
import { ViewRoutingModule } from './view.routing.module';
@NgModule({
  declarations: [ViewComponent, CustomizeDialogComponent],
  imports: [
    CommonModule,
    CopyFieldModule,
    ViewRoutingModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
    MatIconModule,
    PicsurImgModule,
    MatIconModule,
    MomentModule,
    FabModule,
  ],
})
export class ViewRouteModule {}
