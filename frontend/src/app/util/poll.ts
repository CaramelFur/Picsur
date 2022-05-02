import { map, Observable, timer } from 'rxjs';

export function rxjs_poll<T>(period: number, action: () => T): Observable<T> {
  return timer(0, 1000).pipe(map(() => action()));
}
