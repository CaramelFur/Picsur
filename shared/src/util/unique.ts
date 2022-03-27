export function makeUnique<T>(arr: T[]): T[] {
  return arr.reduce(function (accum, current) {
    if (accum.indexOf(current) < 0) {
      accum.push(current);
    }
    return accum;
  }, [] as T[]);
}
