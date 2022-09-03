import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnackBarType } from 'src/app/models/dto/snack-bar-type.dto';
import { UtilService } from 'src/app/util/util-module/util.service';

@Component({
  selector: 'copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.scss'],
})
export class CopyFieldComponent {
  // Two parameters: name, value
  @Input() label: string = 'Loading...';
  @Input() value: string = 'Loading...';

  @Input() showHideButton: boolean = false;
  @Input() hidden: boolean = false;

  @Output('copy') onCopy = new EventEmitter<string>();
  @Output('hide') onHide = new EventEmitter<boolean>();

  constructor(
    private readonly utilService: UtilService,
    private readonly clipboard: Clipboard,
  ) {}

  public copy() {
    if (this.clipboard.copy(this.value)) {
      this.utilService.showSnackBar(`Copied ${this.label}!`, SnackBarType.Info);
      this.onCopy.emit(this.value);
      return;
    }

    return this.utilService.showSnackBar(
      'Copying to clipboard failed',
      SnackBarType.Error,
    );
  }

  public toggleHide() {
    this.hidden = !this.hidden;
    this.onHide.emit(this.hidden);
  }
}
