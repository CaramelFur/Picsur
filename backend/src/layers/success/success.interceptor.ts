import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { ApiResponse } from 'picsur-shared/dist/dto/api/api.dto';
import { map, Observable } from 'rxjs';

// This interceptor will neatly wrap any json response made within nest

@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Buffer) {
          return data;
        } else if (typeof data === 'object') {
          // TODO: mabye validate outgoing requests?

          const status = context.switchToHttp().getResponse().statusCode;
          const response: ApiResponse<any> = {
            success: true,
            statusCode: status,
            timestamp: new Date().toISOString(),

            data,
          };

          return response;
        } else {
          return data;
        }
      }),
    );
  }
}
