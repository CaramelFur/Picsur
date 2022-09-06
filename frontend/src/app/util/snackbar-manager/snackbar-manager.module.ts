import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { SnackBarService } from './snackbar.service';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  providers: [SnackBarService],
})
export class SnackBarManagerModule {
  static forRoot(): ModuleWithProviders<SnackBarManagerModule> {
    return {
      ngModule: SnackBarManagerModule,
      providers: [
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            duration: 4000,
            horizontalPosition: 'left',
          },
        },
      ],
    };
  }
}
