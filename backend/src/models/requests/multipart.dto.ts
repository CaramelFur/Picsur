import { HttpException } from '@nestjs/common';
import { MultipartFile } from 'fastify-multipart';
import { z } from 'zod';

export const MultiPartFileDtoSchema = z.object({
  fieldname: z.string(),
  encoding: z.string(),
  filename: z.string(),
  mimetype: z.string(),
  toBuffer: z.function(undefined, z.any()),
  file: z.any(),
});
export type MultiPartFileDto = z.infer<typeof MultiPartFileDtoSchema>;

export function CreateMultiPartFileDto(
  file: MultipartFile,
  exceptionOnFail: HttpException,
): MultiPartFileDto {
  return {
    fieldname: file.fieldname,
    encoding: file.encoding,
    filename: file.filename,
    mimetype: file.mimetype,
    toBuffer: async () => {
      try {
        return await file.toBuffer();
      } catch (e) {
        throw exceptionOnFail;
      }
    },
    file: file.file,
  };
}

export const MultiPartFieldDtoSchema = z.object({
  fieldname: z.string(),
  encoding: z.string(),
  value: z.string(),
});
export type MultiPartFieldDto = z.infer<typeof MultiPartFieldDtoSchema>;

export function CreateMultiPartFieldDto(file: MultipartFile): MultiPartFieldDto {
  return {
    fieldname: file.fieldname,
    encoding: file.encoding,
    value: (file as any).value,
  };
}
