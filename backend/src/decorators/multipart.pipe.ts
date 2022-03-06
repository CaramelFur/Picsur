import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
  Scope
} from '@nestjs/common';
import { validate } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { MultipartFields, MultipartFile } from 'fastify-multipart';
import { Newable } from 'picsur-shared/dist/types';
import { MultipartConfigService } from '../config/multipart.config.service';
import {
  MultiPartFieldDto,
  MultiPartFileDto
} from '../models/dto/multipart.dto';

@Injectable({ scope: Scope.REQUEST })
export class MultiPartPipe implements PipeTransform {
  private readonly logger = new Logger('MultiPartPipe');

  constructor(private multipartConfigService: MultipartConfigService) {}

  async transform<T extends Object>({
    req,
    data,
  }: {
    req: FastifyRequest;
    data: Newable<T>;
  }) {
    const dtoClass = new data();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    let fields: MultipartFields | null = null;
    try {
      fields = (
        await req.file({
          limits: this.multipartConfigService.getLimits(),
        })
      ).fields;
    } catch (e) {
      this.logger.warn(e);
    }
    if (!fields) throw new BadRequestException('Invalid file');

    for (const key of Object.keys(fields)) {
      if (Array.isArray(fields[key])) {
        continue;
      }

      if ((fields[key] as any).value) {
        (dtoClass as any)[key] = new MultiPartFieldDto(
          fields[key] as MultipartFile,
        );
      } else {
        (dtoClass as any)[key] = new MultiPartFileDto(
          fields[key] as MultipartFile,
          new BadRequestException('Invalid file'),
        );
      }
    }

    const errors = await validate(dtoClass, { forbidUnknownValues: true });
    if (errors.length > 0) {
      this.logger.warn(errors);
      throw new BadRequestException('Invalid file');
    }

    return dtoClass;
  }
}
