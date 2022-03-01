import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBarType } from '../models/snack-bar-type';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

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
}
