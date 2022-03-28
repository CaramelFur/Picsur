import { GlobalLogger, LoggerContext } from './global-logger.service';

export class Logger {
  private static globalLogger = new GlobalLogger();
  private context: LoggerContext;

  constructor(source: string) {
    this.context = { source };
  }

  verbose(...args: any[]) {
    Logger.globalLogger.verbose(args, this.context);
  }

  debug(...args: any[]) {
    Logger.globalLogger.debug(args, this.context);
  }

  log(...args: any[]) {
    Logger.globalLogger.log(args, this.context);
  }

  warn(...args: any[]) {
    Logger.globalLogger.warn(args, this.context);
  }

  error(...args: any[]) {
    Logger.globalLogger.error(args, this.context);
  }
}
