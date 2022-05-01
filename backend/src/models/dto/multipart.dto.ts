import { MultipartFile } from '@fastify/multipart';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { z } from 'zod';

export const MultiPartFileDtoSchema = z.object({
  fieldname: z.string(),
  encoding: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  buffer: z.any(),
  file: z.any(),
});
export type MultiPartFileDto = z.infer<typeof MultiPartFileDtoSchema>;

export async function CreateMultiPartFileDto(
  file: MultipartFile,
): AsyncFailable<MultiPartFileDto> {
  try {
    const buffer = await file.toBuffer();
    return {
      fieldname: file.fieldname,
      encoding: file.encoding,
      filename: file.filename,
      mimetype: file.mimetype,
      buffer,
      file: file.file,
    };
  } catch (e) {
    return Fail(e);
  }
}

export const MultiPartFieldDtoSchema = z.object({
  fieldname: z.string(),
  encoding: z.string(),
  value: z.string(),
});
export type MultiPartFieldDto = z.infer<typeof MultiPartFieldDtoSchema>;

export function CreateMultiPartFieldDto(
  file: MultipartFile,
): MultiPartFieldDto {
  return {
    fieldname: file.fieldname,
    encoding: file.encoding,
    value: (file as any).value,
  };
}
