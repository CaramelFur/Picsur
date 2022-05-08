import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'masonry',
})
export class MasonryPipe<T> implements PipeTransform {
  transform(value: T[], numColumns: number, colNum: number): T[] {
    if (value.length === 0) return value;

    if (
      numColumns < 1 ||
      colNum < 0 ||
      isNaN(numColumns) ||
      isNaN(colNum) ||
      colNum > numColumns
    ) {
      throw new Error('Invalid column configuration');
    }

    return value.filter((val, index) => {
      return index % numColumns === colNum;
    });
  }
}
