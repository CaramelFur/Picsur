import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private readonly translateService: TranslateService,
  ) {}

  public showFailure(error: Failure, logger: Logger): void {
    error.print(logger);

    this.snackbar.showSnackBar(
      this.translate(error.getReason()),
      error.isImportant() ? SnackBarType.Error : SnackBarType.Warning,
    );
  }

  public quitFailure(error: Failure, logger: Logger): void {
    this.showFailure(error, logger);
    this.router.navigate(['/']);
  }

  public warn(warning: string, logger: Logger): void {
    logger.warn(warning);
    this.snackbar.showSnackBar(this.translate(warning), SnackBarType.Warning);
  }

  public error(error: string, logger: Logger): void {
    logger.error(error);
    this.snackbar.showSnackBar(this.translate(error), SnackBarType.Error);
  }

  public info(info: string) {
    this.snackbar.showSnackBar(this.translate(info), SnackBarType.Info);
  }

  public success(success: string) {
    this.snackbar.showSnackBar(this.translate(success), SnackBarType.Success);
  }

  public log(log: string) {
    this.snackbar.showSnackBar(this.translate(log), SnackBarType.Default);
  }

  public quitWarn(warning: string, logger: Logger): void {
    this.warn(warning, logger);
    this.router.navigate(['/']);
  }

  public quitError(error: string, logger: Logger): void {
    this.error(error, logger);
    this.router.navigate(['/']);
  }

  private translate(message: string): string {
    return this.translateService.instant(message);
  }
}
