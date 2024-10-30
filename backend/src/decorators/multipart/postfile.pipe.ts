import { Multipart, MultipartFile } from '@fastify/multipart';
import { Injectable, Logger, PipeTransform, Scope } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Fail, FT } from 'picsur-shared/dist/types/failable';
import { MultipartConfigService } from '../../config/early/multipart.config.service.js';

@Injectable({ scope: Scope.REQUEST })
export class PostFilePipe implements PipeTransform {
  private readonly logger = new Logger(PostFilePipe.name);

  constructor(
    private readonly multipartConfigService: MultipartConfigService,
  ) {}

  async transform({ request }: { request: FastifyRequest }) {
    if (!request.isMultipart()) throw Fail(FT.UsrValidation, 'Invalid file');

    // Only one file is allowed
    const file = await request.file({
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
    const files: MultipartFile[] = allFields.filter(
      (entry) => (entry as any).file !== undefined,
    ) as MultipartFile[];

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
