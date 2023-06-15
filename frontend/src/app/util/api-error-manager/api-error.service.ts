import { Injectable } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { SnackBarType } from '../../models/dto/snack-bar-type.dto';
import { ApiService } from '../../services/api/api.service';
import { Logger } from '../../services/logger/logger.service';
import { SnackBarService } from '../snackbar-manager/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {
  private readonly logger = new Logger(ApiErrorService.name);

  constructor(
    private readonly apiSerivce: ApiService,
    private readonly snackbarService: SnackBarService,
  ) {
    this.subscribeErrors();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  nothing(): void {}

  @AutoUnsubscribe()
  private subscribeErrors() {
    return this.apiSerivce.networkErrors.subscribe((error) => {
      let url = '';
      if (typeof error.url === 'string') url = error.url;
      else url = error.url.url;

      if (url.startsWith('/api')) {
        this.snackbarService.showSnackBar('Network Error', SnackBarType.Error);
      }

      this.logger.error(error.error);
    });
  }
}
