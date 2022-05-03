import { z } from 'zod';
import { createZodDto } from '../../util/create-zod-dto';
import { IsPosInt } from '../../validators/positive-int.validator';

export const PagedRequestSchema = z.object({
  count: IsPosInt(),
  page: IsPosInt(),
});
export class PagedRequest extends createZodDto(PagedRequestSchema) {}
