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
import { request } from 'http';
import Config from 'src/env';
import { Newable } from 'src/types/newable';
import { isArray } from 'util';
import { MultiPartFieldDto, MultiPartFileDto } from './multipart.dto';

const logger = new Logger('MultiPart');
export interface MPFile {
  fieldname: string;
}

export const PostFile = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    const file = await req.file();
    if (file === undefined) throw new BadRequestException('Invalid file');

    const allFields: Multipart[] = Object.values(file.fields).filter(
      (entry) => entry,
    ) as any;

    const files = allFields.filter((entry) => entry.file !== undefined);

    if (files.length !== 1) throw new BadRequestException('Invalid file');

    return await files[0].toBuffer();
  },
);

export class MultiPartDto {}

export const MultiPart = createParamDecorator(
  async <T extends MultiPartDto>(
    data: Newable<T>,
    ctx: ExecutionContext,
  ) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();
    const dtoClass = new data();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    let fields: MultipartFields;
    try {
      fields = (await req.file()).fields;
    } catch (e) {
      console.warn(e);
    }
    if (!fields) throw new BadRequestException('Invalid file');

    for (const key of Object.keys(fields)) {
      if (Array.isArray(fields[key])) {
        continue;
      }

      if ((fields[key] as any).value) {
        dtoClass[key] = new MultiPartFieldDto(fields[key] as MultipartFile);
      } else {
        dtoClass[key] = new MultiPartFileDto(fields[key] as MultipartFile);
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

// TODO: Make better multipart decoder
