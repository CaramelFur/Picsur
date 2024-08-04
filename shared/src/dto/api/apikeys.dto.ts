import { z } from 'zod';
import { EApiKeySchema } from '../../entities/apikey.entity.js';
import { createZodDto } from '../../util/create-zod-dto.js';
import { IsEntityID } from '../../validators/entity-id.validator.js';
import { IsPosInt } from '../../validators/positive-int.validator.js';

// ApiKeyInfo
export const ApiKeyInfoRequestSchema = z.object({
  id: IsEntityID(),
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

// ApiKeyUpdate
export const ApiKeyUpdateRequestSchema = z.object({
  id: IsEntityID(),
  name: z.string().max(255),
});
export class ApiKeyUpdateRequest extends createZodDto(
  ApiKeyUpdateRequestSchema,
) {}

export const ApiKeyUpdateResponseSchema = EApiKeySchema;
export class ApiKeyUpdateResponse extends createZodDto(
  ApiKeyUpdateResponseSchema,
) {}

// ApiKeyDelete
export const ApiKeyDeleteRequestSchema = z.object({
  id: IsEntityID(),
});
export class ApiKeyDeleteRequest extends createZodDto(
  ApiKeyDeleteRequestSchema,
) {}

export const ApiKeyDeleteResponseSchema = EApiKeySchema.omit({
  id: true,
});
export class ApiKeyDeleteResponse extends createZodDto(
  ApiKeyDeleteResponseSchema,
) {}
