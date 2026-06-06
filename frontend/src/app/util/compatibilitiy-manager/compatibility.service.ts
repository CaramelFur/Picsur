import { Inject, Injectable } from '@angular/core';
import { WA_HISTORY } from '@ng-web-apis/common';
import { TranslateService } from '@ngx-translate/core';
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
    private readonly translateService: TranslateService,
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
          title: this.translateService.instant('compatibility.title'),
          description: this.translateService.instant(
            'compatibility.description',
          ),
          buttons: [
            {
              text: this.translateService.instant('compatibility.back'),
              name: 'back',
              color: 'accent',
            },
            {
              text: this.translateService.instant('compatibility.ignore'),
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
