import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatFormFieldAppearance,
  SubscriptSizing,
} from '@angular/material/form-field';
import { FT, Fail } from 'picsur-shared/dist/types';
import { Logger } from 'src/app/services/logger/logger.service';
import { ClipboardService } from 'src/app/util/clipboard.service';
import { ErrorService } from 'src/app/util/error-manager/error.service';

@Component({
  selector: 'copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.scss'],
})
export class CopyFieldComponent {
  private readonly logger = new Logger(CopyFieldComponent.name);

  // Two parameters: name, value
  @Input() label: string = 'Loading...';
  @Input() value: string = 'Loading...';

  @Input() showHideButton: boolean = false;
  @Input() hidden: boolean = false;

  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() subscriptSizing: SubscriptSizing = 'fixed';

  @Output('copy') onCopy = new EventEmitter<string>();
  @Output('hide') onHide = new EventEmitter<boolean>();

  constructor(
    private readonly clipboard: ClipboardService,
    private readonly errorService: ErrorService,
  ) {}

  public async copy() {
    if (await this.clipboard.copy(this.value)) {
      this.errorService.info(`Copied ${this.label}!`);
      this.onCopy.emit(this.value);
      return;
    }

    return this.errorService.showFailure(
      Fail(FT.Internal, 'Copying to clipboard failed'),
      this.logger,
    );
  }

  public toggleHide() {
    this.hidden = !this.hidden;
    this.onHide.emit(this.hidden);
  }
}
