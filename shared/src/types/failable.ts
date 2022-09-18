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
  BadRequest = 'badrequest',
  Permission = 'permission',
  RateLimit = 'ratelimit',
  NotFound = 'notfound',
  RouteNotFound = 'routenotfound',
  Conflict = 'conflict',
  Internal = 'internal',
  Authentication = 'authentication',
  Impossible = 'impossible',
  Network = 'network',
}

interface ILogger {
  error: (message: string) => void;
  warn: (message: string) => void;
  debug: (message: string) => void;
}

interface FTProp {
  important: boolean;
  code: number;
  message: string;
}

const FTProps: {
  [key in FT]: FTProp;
} = {
  [FT.Unknown]: {
    important: false,
    code: 500,
    message: 'An unkown error occurred',
  },
  [FT.Internal]: {
    important: true,
    code: 500,
    message: 'An internal error occurred',
  },
  [FT.Database]: {
    important: true,
    code: 500,
    message: 'A database error occurred',
  },
  [FT.Network]: {
    important: true,
    code: 500,
    message: 'A network error occurred',
  },
  [FT.SysValidation]: {
    important: true,
    code: 500,
    message: 'Validation of internal items failed',
  },
  [FT.UsrValidation]: {
    important: false,
    code: 400,
    message: 'Validation of user input failed',
  },
  [FT.BadRequest]: {
    important: false,
    code: 400,
    message: 'Bad request',
  },
  [FT.Permission]: {
    important: false,
    code: 403,
    message: 'Permission denied',
  },
  [FT.RateLimit]: {
    important: false,
    code: 429,
    message: 'Rate limit exceeded',
  },
  [FT.NotFound]: {
    important: false,
    code: 404,
    message: 'Item(s) could not be found',
  },
  [FT.RouteNotFound]: {
    important: false,
    code: 404,
    message: 'Route not found',
  },
  [FT.Conflict]: {
    important: false,
    code: 409,
    message: 'There was a conflict',
  },
  [FT.Authentication]: {
    important: false,
    code: 200,
    message: 'Authentication failed',
  },
  [FT.Impossible]: {
    important: true,
    code: 422,
    message: 'What you are doing is impossible',
  },
};

export class Failure {
  private __68351953531423479708__id_failure = 1148363914;

  constructor(
    private readonly type: FT = FT.Unknown,
    private readonly reason?: string,
    private readonly stack?: string,
    private readonly debugMessage?: string,
  ) {}

  getReason(): string {
    return this.reason ?? 'Unknown';
  }

  getStack(): string | undefined {
    return this.stack;
  }

  getDebugMessage(): string | undefined {
    return this.debugMessage;
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

  print(
    logger: ILogger,
    options?: {
      notImportant?: boolean;
      prefix?: string;
    },
  ): void {
    const message = this.getReason();
    const logmessage =
      message + (this.getDebugMessage() ? ' - ' + this.getDebugMessage() : '');

    const prefix = options?.prefix ? options.prefix + ' ' : '';
    const logline = `${prefix}${this.getName()}: ${logmessage}`;

    if (this.isImportant() && options?.notImportant !== true) {
      logger.error(logline);
      const stack = this.getStack();
      if (stack) {
        logger.debug(stack);
      }
    } else {
      logger.warn(logline);
    }
  }

  toString(): string {
    return (
      `${this.getName()}: ${this.getReason()} - (${this.debugMessage})` +
      (this.isImportant() ? '\n' + this.stack : '')
    );
  }

  toError(): Error {
    const error = new Error();
    (error as any).message = this;
    return error;
  }

  static deserialize(data: any): Failure {
    if (data.__68351953531423479708__id_failure !== 1148363914) {
      throw new Error('Invalid failure data');
    }

    return new Failure(data.type, data.reason, data.stack, data.debugMessage);
  }
}

export function Fail(type: FT, reason?: any, dbgReason?: any): Failure {
  if (IsFailure(reason) || IsFailure(dbgReason)) {
    throw new Error('Cannot fail with another failure, just return it');
  }

  if (dbgReason === undefined || dbgReason === null) {
    if (reason === undefined || reason === null) {
      // If both are null, just return a default error message
      return new Failure(
        type,
        FTProps[type].message,
        new Error(String(FTProps[type].message)).stack,
        undefined,
      );
    } else if (typeof reason === 'string') {
      // If it is a string, this was intentionally specified, so pass it through
      return new Failure(
        type,
        reason,
        new Error(String(reason)).stack,
        undefined,
      );
    } else if (reason instanceof Error) {
      // In case of an error, we want to keep that hidden, so return the default message
      // Only send the specifics to debug
      return new Failure(
        type,
        FTProps[type].message,
        reason.stack,
        reason.message,
      );
    } else {
      // No clue what it is, so just transform it to a string and return the default message
      return new Failure(
        type,
        FTProps[type].message,
        new Error(String(reason)).stack,
        String(reason),
      );
    }
  } else {
    // In this case we only accept strings for the reason
    const strReason = reason?.toString() ?? FTProps[type].message;

    if (typeof dbgReason === 'string') {
      return new Failure(
        type,
        strReason,
        new Error(String(dbgReason)).stack,
        dbgReason,
      );
    } else if (dbgReason instanceof Error) {
      return new Failure(type, strReason, dbgReason.stack, dbgReason.message);
    } else {
      return new Failure(
        type,
        strReason,
        new Error(String(dbgReason)).stack,
        String(dbgReason),
      );
    }
  }
}

export function IsFailure(value: any): value is Failure {
  return value?.__68351953531423479708__id_failure === 1148363914;
}

export type Failable<T> = T | Failure;

export type AsyncFailable<T> = Promise<Failable<T>>;

export function HasFailed<T>(failable: Failable<T>): failable is Failure {
  if (failable instanceof Promise) throw new Error('Invalid use of HasFailed');
  if (!(failable instanceof Object)) return false;
  return (failable as any).__68351953531423479708__id_failure === 1148363914;
}

export function HasSuccess<T>(failable: Failable<T>): failable is T {
  if (failable instanceof Promise) throw new Error('Invalid use of HasSuccess');
  return (failable as any).__68351953531423479708__id_failure !== 1148363914;
}

export function ThrowIfFailed<V>(failable: Failable<V>): V {
  if (HasFailed(failable)) {
    throw failable;
  }

  return failable;
}

export function FallbackIfFailed<V>(
  failable: Failable<V>,
  fallback: V,
  logger?: ILogger,
): V {
  if (HasFailed(failable)) {
    if (logger) failable.print(logger, { notImportant: true });
    return fallback;
  }

  return failable;
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
