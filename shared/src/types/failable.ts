// This is a simple wrapper for failures
// It makes it a lot more pleasant to work with errors
// Since now they dont just come out of nowhere
//  -> Side effects go brrr

export class Failure {
  private __68351953531423479708__id_failure = 1148363914;

  constructor(
    private readonly reason?: string,
    private readonly stack?: string,
  ) {}

  getReason(): string {
    return this.reason ?? 'Unknown';
  }

  getStack(): string {
    return this.stack ?? 'None';
  }

  static deserialize(data: any): Failure {
    if (data.__68351953531423479708__id_failure !== 1148363914) {
      throw new Error('Invalid failure data');
    }

    return new Failure(data.reason, data.stack);
  }
}

export function Fail(reason?: any): Failure {
  if (typeof reason === 'string') {
    return new Failure(reason);
  } else if (reason instanceof Error) {
    return new Failure(reason.message, reason.stack);
  } else if (reason instanceof Failure) {
    return reason;
  } else {
    return new Failure('Converted(' + reason + ')');
  }
}

export type Failable<T> = T | Failure;

export type AsyncFailable<T> = Promise<Failable<T>>;

export function HasFailed<T>(failable: Failable<T>): failable is Failure {
  if (failable instanceof Promise) throw new Error('Invalid use of HasFailed');
  return (failable as any).__68351953531423479708__id_failure === 1148363914;
}

export function HasSuccess<T>(failable: Failable<T>): failable is T {
  if (failable instanceof Promise) throw new Error('Invalid use of HasSuccess');
  return (failable as any).__68351953531423479708__id_failure !== 1148363914;
}

export function Map<T, U>(
  failable: Failable<T>,
  mapper: (value: T) => U,
): Failable<U> {
  if (HasFailed(failable)) return failable;
  return mapper(failable);
}

export function Open<T, U extends keyof T>(
  failable: Failable<T>,
  key: U,
): Failable<T[U]> {
  if (HasFailed(failable)) return failable;
  return failable[key];
}
