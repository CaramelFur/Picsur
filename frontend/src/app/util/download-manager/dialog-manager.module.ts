import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { I18nModule } from '../../i18n/i18n.module';
import { ErrorManagerModule } from '../error-manager/error-manager.module';
import { DownloadService } from './download.service';

@NgModule({
  imports: [CommonModule, I18nModule, MatDialogModule, ErrorManagerModule],
  providers: [DownloadService],
})
export class DownloadManagerModule {}
