import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { ApiAnySuccessResponse } from 'picsur-shared/dist/dto/api/api.dto';
import { Fail, FT } from 'picsur-shared/dist/types';
import { ZodDtoStatic } from 'picsur-shared/dist/util/create-zod-dto';
import { map, Observable } from 'rxjs';

// This interceptor will neatly wrap any json response made within nest

export interface ZodValidationInterceptorOptions {
  strict?: boolean;
}

@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger();

  // TODO: make work
  private strict: boolean;

  constructor(
    private readonly reflector: Reflector,
    @Optional() options?: ZodValidationInterceptorOptions,
  ) {
    this.strict = options?.strict ?? true;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Buffer) {
          return data;
        } else if (typeof data === 'object') {
          const validated = this.validate(context, data);

          return this.createResponse(context, validated);
        } else {
          return data;
        }
      }),
    );
  }

  private validate(context: ExecutionContext, data: unknown): unknown {
    const schemaStatic = this.reflector.get<ZodDtoStatic>(
      'returns',
      context.getHandler(),
    );

    if (!schemaStatic) {
      throw Fail(
        FT.Internal,
        "Couldn't find schema",
        `No zodSchema found on handler ${context.getHandler().name}`,
      );
    }

    let schema = schemaStatic.zodSchema;

    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      throw Fail(
        FT.Internal,
        'Server produced invalid response',
        `Function ${context.getHandler().name} failed validation: ${
          parseResult.error
        }`,
      );
    }

    return parseResult.data;
  }

  private createResponse(
    context: ExecutionContext,
    data: unknown,
  ): ApiAnySuccessResponse {
    const response = context.switchToHttp().getResponse<FastifyReply>();

    const newResponse: ApiAnySuccessResponse = {
      success: true as true, // really typescript
      statusCode: response.statusCode,
      timestamp: new Date().toISOString(),
      timeMs: Math.round(response.getResponseTime()),

      data,
    };

    return newResponse;
  }
}
