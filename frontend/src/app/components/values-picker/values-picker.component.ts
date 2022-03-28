import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import Fuse from 'fuse.js';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { BehaviorSubject } from 'rxjs';
import { Required } from 'src/app/models/decorators/required.decorator';

@Component({
  selector: 'values-picker',
  templateUrl: './values-picker.component.html',
  styleUrls: ['./values-picker.component.scss'],
})
export class ValuesPickerComponent implements OnInit {
  // Static data
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  // Ui niceties
  @Input('name') @Required name: string = '';
  public get nameCap(): string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  public get nameCapMul(): string {
    return `${this.nameCap}s`;
  }

  // Inputs/oututs
  @Input('selection-list') @Required fullSelection: string[] = [];
  @Input('control') @Required myControl: FormControl;

  @Input('disabled-list') disabledSelection: string[] = [];

  // Selection
  private selectableSubject = new BehaviorSubject<string[]>([]);

  public selectable = this.selectableSubject.asObservable();
  public inputControl = new FormControl('');

  public ngOnInit(): void {
    this.subscribeInputValue();
    this.subscribeMyValue();
  }

  public isDisabled(value: string): boolean {
    return this.disabledSelection.includes(value);
  }

  // Remove/add
  public removeItem(item: string) {
    const selected: string[] = this.myControl.value;
    const newSelection = selected.filter((s) => s !== item);
    this.myControl.setValue(newSelection);
  }

  public addItemInput(event: MatChipInputEvent) {
    const value = (event.value ?? '').trim();
    this.addItem(value);
  }

  public addItemSelect(event: MatAutocompleteSelectedEvent): void {
    this.addItem(event.option.viewValue);
  }

  private addItem(value: string) {
    console.log('adding', value);
    const selectable = this.selectableSubject.getValue();
    if (this.isDisabled(value) || !selectable.includes(value)) return;

    const selected: string[] = this.myControl.value;
    this.myControl.setValue([...selected, value]);

    this.inputControl.setValue('');
  }

  // Update and subscribe
  private updateSelectable() {
    const selected: string[] = this.myControl.value;
    const available = this.fullSelection.filter(
      (s) => !this.isDisabled(s) && !selected.includes(s)
    );

    const searchValue = this.inputControl.value;
    if (searchValue && available.length > 0) {
      const fuse = new Fuse(available);
      const result = fuse.search(searchValue).map((r) => r.item);

      this.selectableSubject.next(result);
    } else {
      this.selectableSubject.next(available);
    }
  }

  @AutoUnsubscribe()
  private subscribeInputValue() {
    return this.inputControl.valueChanges.subscribe((value) => {
      this.updateSelectable();
    });
  }

  @AutoUnsubscribe()
  private subscribeMyValue() {
    return this.myControl.valueChanges.subscribe((value) => {
      this.updateSelectable();
    });
  }
}
