import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Logger,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiErrorResponse } from 'picsur-shared/dist/dto/api/api.dto';
import {
  Fail,
  Failure,
  FT,
  IsFailure,
} from 'picsur-shared/dist/types/failable';

// This will catch any exception that is made in any request
// (As long as its within nest, the earlier fastify stages are not handled here)
// It neatly wraps the error for easier handling on the client

@Catch()
export class MainExceptionFilter implements ExceptionFilter {
  private static readonly logger = new Logger('MainExceptionFilter');

  catch(exception: Failure, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const traceString = `(${request.ip} -> ${request.method} ${request.url})`;

    if (!IsFailure(exception)) {
      exception = this.transformKnownExceptions(exception);
    }

    const status = exception.getCode();
    const type = exception.getType();

    exception.print(MainExceptionFilter.logger, { prefix: traceString });

    const toSend: ApiErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      timeMs: Math.round(response.elapsedTime),

      data: {
        type,
        message: exception.getReason(),
      },
    };

    response.status(status).send(toSend);
  }

  private transformKnownExceptions(exception: any): Failure {
    if (exception instanceof UnauthorizedException) {
      return Fail(FT.Permission, exception);
    } else if (exception instanceof ForbiddenException) {
      return Fail(FT.Permission, exception);
    } else if (exception instanceof NotFoundException) {
      return Fail(FT.RouteNotFound, exception);
    } else if (exception instanceof MethodNotAllowedException) {
      return Fail(FT.RouteNotFound, exception);
    } else if (exception instanceof Error) {
      return Fail(FT.Internal, exception);
    } else {
      return Fail(FT.Unknown, exception);
    }
  }
}
