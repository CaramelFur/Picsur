import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Multipart, MultipartFields, MultipartFile } from 'fastify-multipart';
import { HasFailed } from 'src/lib/maybe';
import { SafeImagesService } from 'src/safeimages/safeimages.service';

@Controller()
export class RootController {
  constructor(private readonly imagesService: SafeImagesService) {}

  @Get('i/:hash')
  async getImage(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('hash') hash: string,
  ) {
    if (!this.imagesService.validateHash(hash))
      throw new BadRequestException('Invalid hash');

    const image = await this.imagesService.retrieveImage(hash);
    if (HasFailed(image))
      throw new NotFoundException('Failed to retrieve image');

    res.type(image.mime);
    return image.data;
  }

  @Post('i')
  async uploadImage(@Req() req: FastifyRequest) {
    if (!req.isMultipart())
      throw new BadRequestException('Not a multipart request');

    const file = await req.file({ limits: {} });
    if (file === undefined) throw new BadRequestException('No file uploaded');

    const allFields: Multipart[] = Object.values(file.fields).filter(
      (entry) => entry,
    ) as any;

    const options = allFields.filter((entry) => entry.file === undefined);
    const files = allFields.filter((entry) => entry.file !== undefined);

    if (files.length !== 1) throw new BadRequestException('Invalid file');

    const image = await files[0].toBuffer();

    const hash = await this.imagesService.uploadImage(image);
    if (HasFailed(hash))
      throw new InternalServerErrorException('Failed to upload image');

    return { hash };
  }
}
