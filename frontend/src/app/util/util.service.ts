import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarType } from '../models/snack-bar-type';
import {
  ConfirmDialogComponent,
  DialogData
} from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  public quitError(message: string) {
    this.showSnackBar(message, SnackBarType.Error);
    this.router.navigate(['/']);
  }

  public showSnackBar(
    message: string,
    type: SnackBarType = SnackBarType.Default
  ) {
    this.snackBar.open(message, '', {
      panelClass: ['mat-toolbar', 'snackbar', type],
    });
  }

  public async showDialog(options: DialogData): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const ref = this.dialog.open(ConfirmDialogComponent, {
        data: options,
        disableClose: true,
      });
      const subscription = ref.beforeClosed().subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }
}
