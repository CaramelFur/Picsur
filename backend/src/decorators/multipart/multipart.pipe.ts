import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  PipeTransform,
  Scope
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { MultipartFields, MultipartFile } from 'fastify-multipart';
import { HasFailed } from 'picsur-shared/dist/types';
import { ZodDtoStatic } from 'picsur-shared/dist/util/create-zod-dto';
import { MultipartConfigService } from '../../config/early/multipart.config.service';
import {
  CreateMultiPartFieldDto,
  CreateMultiPartFileDto
} from '../../models/dto/multipart.dto';

@Injectable({ scope: Scope.REQUEST })
export class MultiPartPipe implements PipeTransform {
  private readonly logger = new Logger('MultiPartPipe');

  constructor(private multipartConfigService: MultipartConfigService) {}

  async transform<T extends Object>(
    req: FastifyRequest,
    metadata: ArgumentMetadata,
  ) {
    let zodSchema = (metadata?.metatype as ZodDtoStatic)?.zodSchema;
    if (!zodSchema) {
      this.logger.error('Invalid scheme on multipart body');
      throw new InternalServerErrorException('Invalid scheme on backend');
    }

    let multipartData = {};
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
        (multipartData as any)[key] = CreateMultiPartFieldDto(
          fields[key] as MultipartFile,
        );
      } else {
        const file = await CreateMultiPartFileDto(fields[key] as MultipartFile);
        if (HasFailed(file)) {
          this.logger.error(file.getReason());
          throw new InternalServerErrorException('Invalid file');
        }
        (multipartData as any)[key] = file;
      }
    }

    // Now validate the class we made, if any properties were invalid, it will error here
    const result = zodSchema.safeParse(multipartData);
    if (!result.success) {
      this.logger.warn(result.error);
      throw new BadRequestException('Invalid file');
    }

    return result.data;
  }
}
