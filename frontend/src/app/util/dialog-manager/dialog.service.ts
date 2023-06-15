import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Logger } from '../../services/logger/logger.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'any',
})
export class DialogService {
  private readonly logger = new Logger(DialogService.name);

  constructor(private readonly dialog: MatDialog) {}

  public async showCustomDialog<T>(
    component: ComponentType<T>,
    data: any,
    options?: {
      dismissable?: boolean;
    },
  ): Promise<any | undefined> {
    return new Promise((resolve) => {
      const ref = this.dialog.open(component, {
        data,
        panelClass: 'small-dialog-padding',
        ...(options?.dismissable !== false
          ? {}
          : { disableClose: true, closeOnNavigation: false }),
        maxHeight: '90vh',
      });
      const subscription = ref.beforeClosed().subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  public async showDialog(
    options: ConfirmDialogData,
  ): Promise<string | undefined> {
    return this.showCustomDialog(ConfirmDialogComponent, options);
  }
}
