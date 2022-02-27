import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  Logger,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { Multipart, MultipartFields, MultipartFile } from 'fastify-multipart';
import { Newable } from 'picsur-shared/dist/types';
import Config from '../env';
import { MultiPartFieldDto, MultiPartFileDto } from '../backenddto/multipart.dto';

const logger = new Logger('MultiPart');
export interface MPFile {
  fieldname: string;
}

export const PostFile = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    const file = await req.file({
      limits: {
        ...Config.uploadLimits,
        files: 1,
      },
    });
    if (file === undefined) throw new BadRequestException('Invalid file');

    const allFields: Multipart[] = Object.values(file.fields).filter(
      (entry) => entry,
    ) as any;

    const files = allFields.filter((entry) => entry.file !== undefined);

    if (files.length !== 1) throw new BadRequestException('Invalid file');

    try {
      return await files[0].toBuffer();
    } catch (e) {
      throw new BadRequestException('Invalid file');
    }
  },
);

export const MultiPart = createParamDecorator(
  async <T extends Object>(data: Newable<T>, ctx: ExecutionContext) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();
    const dtoClass = new data();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    let fields: MultipartFields | null = null;
    try {
      fields = (
        await req.file({
          limits: Config.uploadLimits,
        })
      ).fields;
    } catch (e) {
      logger.warn(e);
    }
    if (!fields) throw new BadRequestException('Invalid file');

    for (const key of Object.keys(fields)) {
      if (Array.isArray(fields[key])) {
        continue;
      }

      if ((fields[key] as any).value) {
        (dtoClass as any)[key] = new MultiPartFieldDto(fields[key] as MultipartFile);
      } else {
        (dtoClass as any)[key] = new MultiPartFileDto(
          fields[key] as MultipartFile,
          new BadRequestException('Invalid file'),
        );
      }
    }

    const errors = await validate(dtoClass, { forbidUnknownValues: true });
    if (errors.length > 0) {
      logger.warn(errors);
      throw new BadRequestException('Invalid file');
    }

    return dtoClass;
  },
);
