import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ApiErrorService } from './apierror.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
  ],
  declarations: [ConfirmDialogComponent],
})
export class UtilModule {
  static forRoot(): ModuleWithProviders<UtilModule> {
    return {
      ngModule: UtilModule,
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

  // Start apiErrorService
  constructor(private apiErrorService: ApiErrorService) {}
}
