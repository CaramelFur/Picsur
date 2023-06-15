import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarType } from '../../models/dto/snack-bar-type.dto';
import { Logger } from '../../services/logger/logger.service';
import { BootstrapService, BSScreenSize } from '../bootstrap.service';

@Injectable({
  providedIn: 'any',
})
export class SnackBarService {
  private readonly logger = new Logger(SnackBarService.name);

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly bootstrap: BootstrapService,
  ) {}

  public showSnackBar(
    message: string,
    type: SnackBarType = SnackBarType.Default,
    duration: number | undefined | null = null,
  ) {
    this.snackBar.open(message, '', {
      panelClass: ['mat-toolbar', 'snackbar', type],
      verticalPosition:
        this.bootstrap.screenSizeSnapshot() > BSScreenSize.xs
          ? 'bottom'
          : 'top',
      ...(duration !== null ? { duration } : {}),
    });
  }
}
