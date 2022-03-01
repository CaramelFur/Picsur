import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from './util.service';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

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
