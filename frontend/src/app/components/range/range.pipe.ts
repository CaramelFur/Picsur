import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
})
export class RangePipe implements PipeTransform {
  transform(length: unknown): number[] {
    if (typeof length === 'number') {
      return Array.from({ length }, (_, i) => i);
    }

    if (
      Array.isArray(length) &&
      typeof length[0] === 'number' &&
      typeof length[1] === 'number'
    ) {
      return Array.from(
        { length: length[1] + 1 - length[0] },
        (_, i) => i + length[0],
      );
    }

    throw new Error('Invalid range');
  }
}
