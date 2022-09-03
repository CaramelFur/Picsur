import { z } from 'zod';
import { EApiKeySchema } from '../../entities/apikey.entity';
import { createZodDto } from '../../util/create-zod-dto';
import { IsPosInt } from '../../validators/positive-int.validator';

// ApiKeyInfo
export const ApiKeyInfoRequestSchema = EApiKeySchema.pick({
  key: true,
});
export class ApiKeyInfoRequest extends createZodDto(ApiKeyInfoRequestSchema) {}

export const ApiKeyInfoResponseSchema = EApiKeySchema;
export class ApiKeyInfoResponse extends createZodDto(
  ApiKeyInfoResponseSchema,
) {}

// ApiKeyList

export const ApiKeyListRequestSchema = z.object({
  count: IsPosInt(),
  page: IsPosInt(),
  user_id: z.string().uuid().optional(),
});
export class ApiKeyListRequest extends createZodDto(ApiKeyListRequestSchema) {}

export const ApiKeyListResponseSchema = z.object({
  results: z.array(EApiKeySchema),
  total: IsPosInt(),
  page: IsPosInt(),
  pages: IsPosInt(),
});
export class ApiKeyListResponse extends createZodDto(
  ApiKeyListResponseSchema,
) {}

// ApiKeyCreate
export const ApiKeyCreateResponseSchema = EApiKeySchema;
export class ApiKeyCreateResponse extends createZodDto(
  ApiKeyCreateResponseSchema,
) {}

// ApiKeyDelete
export const ApiKeyDeleteRequestSchema = EApiKeySchema.pick({
  key: true,
});
export class ApiKeyDeleteRequest extends createZodDto(
  ApiKeyDeleteRequestSchema,
) {}

export const ApiKeyDeleteResponseSchema = EApiKeySchema;
export class ApiKeyDeleteResponse extends createZodDto(
  ApiKeyDeleteResponseSchema,
) {}
