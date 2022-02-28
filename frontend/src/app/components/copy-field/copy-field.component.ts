import { Component, Input } from '@angular/core';

@Component({
  selector: 'copy-field',
  templateUrl: './copy-field.component.html',
  styleUrls: ['./copy-field.component.scss'],
})
export class CopyFieldComponent {
  // Two paramets: name, value
  @Input() name: string;
  @Input() value: string;

  public copy() {

  }
}
