import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { UtilService } from './util.service';

@NgModule({
  declarations: [],
  providers: [
    UtilService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 4000,
        horizontalPosition: 'left',
      },
    },
  ],
  imports: [CommonModule, MatSnackBarModule, RouterModule],
})
export class UtilModule {}
