import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MomentModule } from 'ngx-moment';
import { CopyFieldModule } from 'src/app/components/copy-field/copy-field.module';
import { FabModule } from 'src/app/components/fab/fab.module';
import { PicsurImgModule } from 'src/app/components/picsur-img/picsur-img.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DownloadManagerModule } from 'src/app/util/download-manager/dialog-manager.module';
import { ErrorManagerModule } from 'src/app/util/error-manager/error-manager.module';
import { CustomizeDialogComponent } from './customize-dialog/customize-dialog.component';
import { ViewComponent } from './view.component';
import { ViewRoutingModule } from './view.routing.module';
@NgModule({
  declarations: [ViewComponent, CustomizeDialogComponent],
  imports: [
    CommonModule,
    ErrorManagerModule,
    DownloadManagerModule,
    DialogModule,

    CopyFieldModule,
    ViewRoutingModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule,
    MatIconModule,
    PicsurImgModule,
    MatIconModule,
    MomentModule,
    FabModule,
    PipesModule,
  ],
})
export class ViewRouteModule {}
