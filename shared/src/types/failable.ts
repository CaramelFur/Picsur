// This is a simple wrapper for failures
// It makes it a lot more pleasant to work with errors
// Since now they dont just come out of nowhere
//  -> Side effects go brrr

// Failuretype
export enum FT {
  Unknown = 'unknown',
  Database = 'database',
  SysValidation = 'sysvalidation',
  UsrValidation = 'usrvalidation',
  Permission = 'permission',
  NotFound = 'notFound',
  Conflict = 'conflict',
  Internal = 'internal',
  Authentication = 'authentication',
  Impossible = 'impossible',
  Network = 'network',
}

interface FTProp {
  important: boolean;
  code: number;
}

const FTProps: {
  [key in FT]: FTProp;
} = {
  [FT.Unknown]: {
    important: false,
    code: 500,
  },
  [FT.Internal]: {
    important: true,
    code: 500,
  },
  [FT.Database]: {
    important: true,
    code: 500,
  },
  [FT.Network]: {
    important: true,
    code: 500,
  },
  [FT.SysValidation]: {
    important: true,
    code: 500,
  },
  [FT.UsrValidation]: {
    important: false,
    code: 400,
  },
  [FT.Permission]: {
    important: false,
    code: 403,
  },
  [FT.NotFound]: {
    important: false,
    code: 404,
  },
  [FT.Conflict]: {
    important: false,
    code: 409,
  },
  [FT.Authentication]: {
    important: false,
    code: 200,
  } ,
  [FT.Impossible]: {
    important: true,
    code: 422,
  } ,
};

export class Failure {
  private __68351953531423479708__id_failure = 1148363914;

  constructor(
    private readonly reason?: string,
    private readonly stack?: string,
    private readonly type: FT = FT.Unknown,
  ) {}

  getReason(): string {
    return this.reason ?? 'Unknown';
  }

  getStack(): string | undefined {
    return this.stack;
  }

  getType(): FT {
    return this.type;
  }

  getName(): string {
    const capitalizedType =
      this.type.charAt(0).toUpperCase() + this.type.slice(1);
    return `${capitalizedType}Failure`;
  }

  getCode(): number {
    return FTProps[this.type].code;
  }

  isImportant() {
    return FTProps[this.type].important;
  }

  static deserialize(data: any): Failure {
    if (data.__68351953531423479708__id_failure !== 1148363914) {
      throw new Error('Invalid failure data');
    }

    return new Failure(data.reason, data.stack, data.type);
  }
}

export function Fail(type: FT, reason: any): Failure {
  if (typeof reason === 'string') {
    return new Failure(reason, undefined, type);
  } else if (reason instanceof Error) {
    return new Failure(reason.message, reason.stack, type);
  } else if (reason instanceof Failure) {
    throw new Error('Cannot fail with a failure, just return it');
  } else {
    return new Failure('Unkown reason', undefined, type);
  }
}

export function IsFailure(value: any): value is Failure {
  return value.__68351953531423479708__id_failure === 1148363914;
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
