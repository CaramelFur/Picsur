import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify';
import { ApiErrorResponse } from 'picsur-shared/dist/dto/api.dto';

@Catch(HttpException)
export class MainExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    const toSend: ApiErrorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),

      data: {
        message: exception.message,
      },
    };

    response.status(status).send(toSend);
  }
}
