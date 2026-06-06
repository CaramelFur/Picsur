import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatFormFieldAppearance,
  SubscriptSizing,
} from '@angular/material/form-field';
import { TranslateService } from '@ngx-translate/core';
import { FT, Fail } from 'picsur-shared/dist/types/failable';
import { Logger } from '../../services/logger/logger.service';
import { ClipboardService } from '../../util/clipboard.service';
import { ErrorService } from '../../util/error-manager/error.service';

@Component({
  selector: 'copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.scss'],
})
export class CopyFieldComponent {
  private readonly logger = new Logger(CopyFieldComponent.name);

  // Two parameters: name, value
  @Input() label = 'common.loading';
  @Input() value = 'common.loading';

  @Input() showHideButton = false;
  @Input() hidden = false;

  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() subscriptSizing: SubscriptSizing = 'fixed';

  @Output('copy') onCopy = new EventEmitter<string>();
  @Output('hide') onHide = new EventEmitter<boolean>();

  constructor(
    private readonly clipboard: ClipboardService,
    private readonly errorService: ErrorService,
    private readonly translateService: TranslateService,
  ) {}

  public async copy() {
    if (await this.clipboard.copy(this.value)) {
      this.errorService.info(
        this.translateService.instant('copyField.copied', {
          label: this.translateService.instant(this.label),
        }),
      );
      this.onCopy.emit(this.value);
      return;
    }

    return this.errorService.showFailure(
      Fail(FT.Internal, this.translateService.instant('copyField.copyFailed')),
      this.logger,
    );
  }

  public toggleHide() {
    this.hidden = !this.hidden;
    this.onHide.emit(this.hidden);
  }
}
