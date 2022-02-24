import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable, map } from 'rxjs';

@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Buffer) {
          return data;
        } else if (typeof data === 'object') {
          const status = context.switchToHttp().getResponse().statusCode;
          return {
            success: status < 400,
            statusCode: status,
            timestamp: new Date().toISOString(),

            data,
          };
        } else {
          return data;
        }
      }),
    );
  }
}
