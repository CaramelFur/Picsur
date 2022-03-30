// This is a simple wrapper for failures
// It makes it a lot more pleasant to work with errors
// Since now they dont just come out of nowhere
//  -> Side effects go brrr

export class Failure {
  constructor(private readonly reason?: string) {}

  getReason(): string {
    return this.reason ?? 'Unknown';
  }
}

export function Fail(reason?: string): Failure {
  return new Failure(reason);
}

export type Failable<T> = T | Failure;

export type AsyncFailable<T> = Promise<Failable<T>>;

export function HasFailed<T>(failable: Failable<T>): failable is Failure {
  if (failable instanceof Promise) throw new Error('Invalid use of HasFailed');
  return failable instanceof Failure;
}

export function HasSuccess<T>(failable: Failable<T>): failable is T {
  if (failable instanceof Promise) throw new Error('Invalid use of HasSuccess');
  return !(failable instanceof Failure);
}
