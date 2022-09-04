import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorManagerModule } from '../error-manager/error-manager.module';
import { DownloadService } from './download.service';

@NgModule({
  imports: [CommonModule, MatDialogModule, ErrorManagerModule],
  providers: [DownloadService],
})
export class DownloadManagerModule {}
