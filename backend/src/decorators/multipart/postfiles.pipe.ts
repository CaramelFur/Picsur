import { MultipartFile } from '@fastify/multipart';
import { Injectable, Logger, PipeTransform, Scope } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FT, Fail } from 'picsur-shared/dist/types/failable';
import { MultipartConfigService } from '../../config/early/multipart.config.service.js';

export type FileIterator = AsyncIterableIterator<MultipartFile>;

@Injectable({ scope: Scope.REQUEST })
export class MultiPartPipe implements PipeTransform {
  private readonly logger = new Logger(MultiPartPipe.name);

  constructor(
    private readonly multipartConfigService: MultipartConfigService,
  ) {}

  async transform({ request, data }: { data: any; request: FastifyRequest }) {
    const filesLimit = typeof data === 'number' ? data : undefined;

    if (!request.isMultipart()) throw Fail(FT.UsrValidation, 'Invalid files');

    const files = request.files({
      limits: this.multipartConfigService.getLimits(filesLimit),
    });

    return files;
  }
}
