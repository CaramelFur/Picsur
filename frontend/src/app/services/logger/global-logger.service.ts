export enum LoggerLevel {
  error = 'error',
  warn = 'warn',
  log = 'log',
  verbose = 'verbose',
  debug = 'debug',
}
export interface LoggerContext {
  source: string;
}
export const DEFAULT_LOGGER_LEVELS: string[] = Object.values(LoggerLevel);

const LoggerStyles: {
  [key in LoggerLevel]: string;
} = {
  [LoggerLevel.error]: 'color: red; font-weight: bold',
  [LoggerLevel.warn]: 'color: orange; font-weight: bold',
  [LoggerLevel.log]: 'color: cyan; font-weight: bold',
  [LoggerLevel.verbose]: 'font-weight: bold',
  [LoggerLevel.debug]: 'color: gray; font-weight: bold',
};

const LoggerFunctions: {
  [key in LoggerLevel]: 'error' | 'warn' | 'log' | 'debug';
} = {
  [LoggerLevel.error]: 'error',
  [LoggerLevel.warn]: 'warn',
  [LoggerLevel.log]: 'log',
  [LoggerLevel.verbose]: 'log',
  [LoggerLevel.debug]: 'debug',
};

export class GlobalLogger {
  private enabledLevels: string[] = [];

  constructor() {
    this.enabledLevels = DEFAULT_LOGGER_LEVELS;
  }

  verbose(args: any[], context: LoggerContext) {
    this.sendLog(args, LoggerLevel.verbose, context);
  }

  debug(args: any[], context: LoggerContext) {
    this.sendLog(args, LoggerLevel.debug, context);
  }

  log(args: any[], context: LoggerContext) {
    this.sendLog(args, LoggerLevel.log, context);
  }

  warn(args: any[], context: LoggerContext) {
    this.sendLog(args, LoggerLevel.warn, context);
  }

  error(args: any[], context: LoggerContext) {
    this.sendLog(args, LoggerLevel.error, context);
  }

  setLogLevels(levels: string[]) {
    this.enabledLevels = levels;
  }

  private sendLog(args: any[], level: LoggerLevel, context: LoggerContext) {
    if (!this.enabledLevels.includes(level)) {
      return;
    }

    const processedArgs = args.map((a) => {
      if (typeof a === 'string') {
        return a;
      } else if (a instanceof Error) {
        return a.message;
      } else {
        return a.toString();
      }
    });

    const styles = LoggerStyles[level];
    const message = ['%c' + context.source, styles, ...processedArgs];
    console[LoggerFunctions[level]](...message);
  }
}
