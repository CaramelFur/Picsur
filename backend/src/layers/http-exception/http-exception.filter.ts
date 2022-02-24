import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class MainExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    response.status(status).send({
      success: status < 400,
      statusCode: status,
      timestamp: new Date().toISOString(),

      data: {
        message: exception.message,
      },
    });
  }
}
