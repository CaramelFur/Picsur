import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Multipart } from 'fastify-multipart';
import { request } from 'http';
import Config from 'src/env';

export interface MPFile {
  fieldname: string;
}

export const PostFile = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const req: FastifyRequest = ctx.switchToHttp().getRequest();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    const file = await req.file({
      limits: { fileSize: Config.limits.maxFileSize, files: 1 },
    });
    if (file === undefined) throw new BadRequestException('Invalid file');

    const allFields: Multipart[] = Object.values(file.fields).filter(
      (entry) => entry,
    ) as any;

    const files = allFields.filter((entry) => entry.file !== undefined);

    if (files.length !== 1) throw new BadRequestException('Invalid file');

    return await files[0].toBuffer();
  },
);

// TODO: Make better multipart decoder
