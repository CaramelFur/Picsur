import { Multipart } from '@fastify/multipart';
import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { MultipartConfigService } from '../../config/early/multipart.config.service';

@Injectable({ scope: Scope.REQUEST })
export class PostFilePipe implements PipeTransform {
  private readonly logger = new Logger('PostFilePipe');

  constructor(private multipartConfigService: MultipartConfigService) {}

  async transform({ req }: { req: FastifyRequest }) {
    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    // Only one file is allowed
    const file = await req.file({
      limits: {
        ...this.multipartConfigService.getLimits(),
        files: 1,
      },
    });
    if (file === undefined) throw new BadRequestException('Invalid file');

    // Remove empty fields
    const allFields: Multipart[] = Object.values(file.fields).filter(
      (entry) => entry,
    ) as any;

    // Remove non-file fields
    const files = allFields.filter((entry) => entry.file !== undefined);

    if (files.length !== 1) throw new BadRequestException('Invalid file');

    // Return a buffer of the file
    try {
      return await files[0].toBuffer();
    } catch (e) {
      this.logger.warn(e);
      throw new BadRequestException('Invalid file');
    }
  }
}
