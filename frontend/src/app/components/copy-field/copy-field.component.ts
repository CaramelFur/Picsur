import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
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

  constructor(private utilService: UtilService, private clipboard: Clipboard) {}

  public copy() {
    if (this.clipboard.copy(this.value)) {
      this.utilService.showSnackBar(`Copied ${this.label}!`, SnackBarType.Info);
      return;
    }

    return this.utilService.showSnackBar(
      'Copying to clipboard failed',
      SnackBarType.Error,
    );
  }
}
