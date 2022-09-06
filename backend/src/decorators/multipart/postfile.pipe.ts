import { Multipart } from '@fastify/multipart';
import { Injectable, Logger, PipeTransform, Scope } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Fail, FT } from 'picsur-shared/dist/types';
import { MultipartConfigService } from '../../config/early/multipart.config.service';

@Injectable({ scope: Scope.REQUEST })
export class PostFilePipe implements PipeTransform {
  private readonly logger = new Logger(PostFilePipe.name);

  constructor(
    private readonly multipartConfigService: MultipartConfigService,
  ) {}

  async transform({ req }: { req: FastifyRequest }) {
    if (!req.isMultipart()) throw Fail(FT.UsrValidation, 'Invalid file');

    // Only one file is allowed
    const file = await req.file({
      limits: {
        ...this.multipartConfigService.getLimits(),
        files: 1,
      },
    });
    if (file === undefined) throw Fail(FT.UsrValidation, 'Invalid file');

    // Remove empty fields
    const allFields: Multipart[] = Object.values(file.fields).filter(
      (entry) => entry,
    ) as any;

    // Remove non-file fields
    const files = allFields.filter((entry) => entry.file !== undefined);

    if (files.length !== 1) throw Fail(FT.UsrValidation, 'Invalid file');

    // Return a buffer of the file
    try {
      return await files[0].toBuffer();
    } catch (e) {
      this.logger.warn(e);
      throw Fail(FT.Internal, 'Invalid file');
    }
  }
}
