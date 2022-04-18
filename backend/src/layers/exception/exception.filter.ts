import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiErrorResponse } from 'picsur-shared/dist/dto/api/api.dto';

// This will catch any exception that is made in any request
// (As long as its within nest, the earlier fastify stages are not handled here)
// It neatly wraps the error for easier handling on the client

@Catch()
export class MainExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger('MainExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof Error) {
      MainExceptionFilter.logger.warn(exception.message);
      MainExceptionFilter.logger.debug(exception.stack);
    } else {
      MainExceptionFilter.logger.warn(exception);
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const toSend: ApiErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),

      data: {
        message,
      },
    };

    response.status(status).send(toSend);
  }
}
