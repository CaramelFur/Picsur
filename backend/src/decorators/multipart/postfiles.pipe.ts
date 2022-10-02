import { MultipartFile } from '@fastify/multipart';
import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Fail, FT } from 'picsur-shared/dist/types';
import { MultipartConfigService } from '../../config/early/multipart.config.service';

export type FileIterator = AsyncIterableIterator<MultipartFile>;

@Injectable({ scope: Scope.REQUEST })
export class MultiPartPipe implements PipeTransform {
  private readonly logger = new Logger(MultiPartPipe.name);

  constructor(
    private readonly multipartConfigService: MultipartConfigService,
  ) {}

  async transform<T extends Object>(
    { request, data }: { data: any; request: FastifyRequest },
    metadata: ArgumentMetadata,
  ) {
    const filesLimit = typeof data === 'number' ? data : undefined;

    if (!request.isMultipart()) throw Fail(FT.UsrValidation, 'Invalid files');

    const files = request.files({
      limits: this.multipartConfigService.getLimits(filesLimit),
    });

    return files;
  }
}
