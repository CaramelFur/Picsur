import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
  Scope
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Multipart } from 'fastify-multipart';
import { MultipartConfigService } from '../config/multipart.config.service';

@Injectable({ scope: Scope.REQUEST })
export class PostFilePipe implements PipeTransform {
  private readonly logger = new Logger('PostFilePipe');

  constructor(private multipartConfigService: MultipartConfigService) {}

  async transform({ req }: { req: FastifyRequest }) {
    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    const file = await req.file({
      limits: {
        ...this.multipartConfigService.getLimits(),
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
      this.logger.warn(e);
      throw new BadRequestException('Invalid file');
    }
  }
}
