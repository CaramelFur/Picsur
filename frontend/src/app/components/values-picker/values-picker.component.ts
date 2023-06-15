import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import Fuse from 'fuse.js';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe-decorator';
import { BehaviorSubject } from 'rxjs';
import { Required } from '../../models/decorators/required.decorator';

@Component({
  selector: 'values-picker',
  templateUrl: './values-picker.component.html',
  styleUrls: ['./values-picker.component.scss'],
})
export class ValuesPickerComponent implements OnInit, OnChanges {
  // Static data
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Ui niceties
  @Input('name') @Required name = '';
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

  @Input('value-mapper')
  valueMapper: (value: string) => string = (value) => value;

  // Selection
  private selectableSubject = new BehaviorSubject<string[]>([]);
  private foundSubject = new BehaviorSubject<string[]>([]);

  public found = this.foundSubject.asObservable();
  public inputControl = new FormControl('');

  public ngOnInit(): void {
    this.subscribeInputValue();
    this.subscribeMyValue();
  }

  public ngOnChanges(): void {
    this.updateSelectable();
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
    this.addItem(event.option.value);
  }

  private addItem(value: string) {
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
      (s) => !this.isDisabled(s) && !selected.includes(s),
    );

    this.selectableSubject.next(available);

    const searchValue = this.inputControl.value;
    if (searchValue && available.length > 0) {
      const fuse = new Fuse(available.map(this.valueMapper));
      const result = fuse
        .search(searchValue, {
          limit: 10,
        })
        .map((r) => available[r.refIndex]);

      this.foundSubject.next(result);
    } else {
      this.foundSubject.next(available);
    }
  }

  @AutoUnsubscribe()
  private subscribeInputValue() {
    return this.inputControl.valueChanges.subscribe(() => {
      this.updateSelectable();
    });
  }

  @AutoUnsubscribe()
  private subscribeMyValue() {
    return this.myControl.valueChanges.subscribe(() => {
      this.updateSelectable();
    });
  }
}
