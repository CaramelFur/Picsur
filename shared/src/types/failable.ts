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

// TODO: prevent promise from being allowed in these 2 functions

export function HasFailed<T>(failable: Failable<T>): failable is Failure {
  return failable instanceof Failure;
}

export function HasSuccess<T>(failable: Failable<T>): failable is T {
  return !(failable instanceof Failure);
}
