import { throttleTime } from 'rxjs';

export const Throttle = <T>(time: number) =>
  throttleTime<T>(time, undefined, { leading: true, trailing: true });
