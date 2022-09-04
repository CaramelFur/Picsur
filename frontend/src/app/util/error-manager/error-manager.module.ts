import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SnackBarManagerModule } from '../snackbar-manager/snackbar-manager.module';
import { ErrorService } from './error.service';

@NgModule({
  imports: [CommonModule, SnackBarManagerModule.forRoot(), RouterModule],
  providers: [ErrorService],
})
export class ErrorManagerModule {}
