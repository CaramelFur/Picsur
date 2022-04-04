/**
 * This file was originally taken directly from:
 *   https://github.com/anatine/zod-plugins/blob/main/libs/zod-nestjs/src/lib/zod-validation-pipe.ts
 */

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  PipeTransform
} from '@nestjs/common';
import { ZodDtoStatic } from 'picsur-shared/dist/util/create-zod-dto';

export interface ZodValidationPipeOptions {
  strict?: boolean;
  validateCustom?: boolean;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private strict: boolean;
  private validateCustom: boolean;

  constructor(@Optional() options?: ZodValidationPipeOptions) {
    this.strict = options?.strict ?? true;
    this.validateCustom = options?.validateCustom ?? false;
  }

  public transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (!this.validateCustom && metadata.type === 'custom') return value;

    let zodSchema = (metadata?.metatype as ZodDtoStatic)?.zodSchema;

    if (zodSchema) {
      const parseResult = zodSchema.safeParse(value);

      if (!parseResult.success) {
        throw new BadRequestException();
      }

      return parseResult.data;
    }

    return value;
  }
}
