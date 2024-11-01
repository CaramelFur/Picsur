import { Inject, Injectable } from '@angular/core';
import { WA_HISTORY } from '@ng-web-apis/common';
import { HasFailed } from 'picsur-shared/dist/types/failable';
import { InfoService } from '../../services/api/info.service';
import { Logger } from '../../services/logger/logger.service';
import { DialogService } from '../dialog-manager/dialog.service';
import { ErrorService } from '../error-manager/error.service';

@Injectable({
  providedIn: 'root',
})
export class CompatibilityService {
  private readonly logger = new Logger(CompatibilityService.name);

  constructor(
    private readonly infoService: InfoService,
    private readonly errorService: ErrorService,
    private readonly dialogService: DialogService,
    @Inject(WA_HISTORY) private readonly history: History,
  ) {
    // TODO: Better compatibility check
    //this.checkCompatibility().catch(this.logger.error);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  nothing() {}

  private async checkCompatibility() {
    const isCompatible = await this.infoService.isCompatibleWithServer();

    if (HasFailed(isCompatible)) {
      return this.errorService.showFailure(isCompatible, this.logger);
    }

    if (!isCompatible) {
      this.dialogService
        .showDialog({
          title: 'Server is not compatible',
          description:
            'The server is not compatible with this version of the client. You can ignore this, but expect things to not work.',
          buttons: [
            {
              text: 'Back',
              name: 'back',
              color: 'accent',
            },
            {
              text: 'Ignore',
              name: 'ignore',
              color: 'warn',
            },
          ],
        })
        .then((button) => {
          if (button === 'ignore') {
            this.logger.warn('Ignoring server compatibility');
          } else {
            this.checkCompatibility();
            // Go to previous page
            this.history.back();
          }
        });
    }
  }
}
