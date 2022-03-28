import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
  Scope
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { MultipartFields, MultipartFile } from 'fastify-multipart';
import { Newable } from 'picsur-shared/dist/types';
import { strictValidate } from 'picsur-shared/dist/util/validate';
import { MultipartConfigService } from '../config/early/multipart.config.service';
import {
  MultiPartFieldDto,
  MultiPartFileDto
} from '../models/requests/multipart.dto';

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
    // Data should be a validatable class constructor
    const dtoClass = new data();

    if (!req.isMultipart()) throw new BadRequestException('Invalid file');

    // Fetch all fields from the request
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

    // Loop over every formfield that was sent
    for (const key of Object.keys(fields)) {
      // Ignore duplicate fields
      if (Array.isArray(fields[key])) {
        continue;
      }

      // Use the value property to differentiate between a field and a file
      // And then put the value into the correct property on the validatable class
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

    // Now validate the class we made, if any properties were invalid, it will error here
    const errors = await strictValidate(dtoClass);
    if (errors.length > 0) {
      this.logger.warn(errors);
      throw new BadRequestException('Invalid file');
    }

    return dtoClass;
  }
}
