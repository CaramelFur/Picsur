import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Failure } from 'picsur-shared/dist/types/failable';
import { SnackBarType } from '../../models/dto/snack-bar-type.dto';
import { Logger } from '../../services/logger/logger.service';
import { SnackBarService } from '../snackbar-manager/snackbar.service';

@Injectable({
  providedIn: 'any',
})
export class ErrorService {
  constructor(
    private readonly snackbar: SnackBarService,
    private readonly router: Router,
  ) {}

  public showFailure(error: Failure, logger: Logger): void {
    error.print(logger);

    this.snackbar.showSnackBar(
      error.getReason(),
      error.isImportant() ? SnackBarType.Error : SnackBarType.Warning,
    );
  }

  public quitFailure(error: Failure, logger: Logger): void {
    this.showFailure(error, logger);
    this.router.navigate(['/']);
  }

  public warn(warning: string, logger: Logger): void {
    logger.warn(warning);
    this.snackbar.showSnackBar(warning, SnackBarType.Warning);
  }

  public error(error: string, logger: Logger): void {
    logger.error(error);
    this.snackbar.showSnackBar(error, SnackBarType.Error);
  }

  public info(info: string) {
    this.snackbar.showSnackBar(info, SnackBarType.Info);
  }

  public success(success: string) {
    this.snackbar.showSnackBar(success, SnackBarType.Success);
  }

  public log(log: string) {
    this.snackbar.showSnackBar(log, SnackBarType.Default);
  }

  public quitWarn(warning: string, logger: Logger): void {
    this.warn(warning, logger);
    this.router.navigate(['/']);
  }

  public quitError(error: string, logger: Logger): void {
    this.error(error, logger);
    this.router.navigate(['/']);
  }
}
