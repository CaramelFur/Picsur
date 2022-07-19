import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiErrorResponse } from 'picsur-shared/dist/dto/api/api.dto';
import { IsFailure } from 'picsur-shared/dist/types/failable';

// This will catch any exception that is made in any request
// (As long as its within nest, the earlier fastify stages are not handled here)
// It neatly wraps the error for easier handling on the client

@Catch()
export class MainExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger('MainExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const traceString = `(${request.ip} -> ${request.method} ${request.url})`;

    if (!IsFailure(exception)) {
      MainExceptionFilter.logger.error(
        traceString + ' Unkown exception: ' + exception,
      );
      return;
    }

    const status = exception.getCode();
    const type = exception.getType();

    const message = exception.getReason();
    const logmessage =
      message +
      (exception.getDebugMessage() ? ' - ' + exception.getDebugMessage() : '');

    if (exception.isImportant()) {
      MainExceptionFilter.logger.error(
        `${traceString} ${exception.getName()}: ${logmessage}`,
      );
      if (exception.getStack()) {
        MainExceptionFilter.logger.debug(exception.getStack());
      }
    } else {
      MainExceptionFilter.logger.warn(
        `${traceString} ${exception.getName()}: ${logmessage}`,
      );
    }

    const toSend: ApiErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),

      data: {
        type,
        message,
      },
    };

    response.status(status).send(toSend);
  }
}
