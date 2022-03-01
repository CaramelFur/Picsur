import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.scss'],
})
export class CopyFieldComponent {
  // Two paramets: name, value
  @Input() label: string = 'Loading...';
  @Input() value: string = 'Loading...';

  constructor(private snackBar: MatSnackBar) {}

  public copy() {
    navigator.clipboard.writeText(this.value);

    this.snackBar.open(`Copied ${this.label}!`);
  }
}
