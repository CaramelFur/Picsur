import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ApiResponse } from 'picsur-shared/dist/dto/api.dto';
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
