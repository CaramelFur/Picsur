import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HasFailed } from 'picsur-shared/dist/types';
import { MultiPart } from '../../decorators/multipart.decorator';
import { ImageManagerService } from '../../managers/imagemanager/imagemanager.service';
import { ImageUploadDto } from '../../backenddto/imageroute.dto';
import { isHash } from 'class-validator';
@Controller('i')
export class ImageController {
  constructor(private readonly imagesService: ImageManagerService) {}

  @Get(':hash')
  async getImage(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('hash') hash: string,
  ) {
    if (!isHash(hash, 'sha256')) throw new BadRequestException('Invalid hash');

    const image = await this.imagesService.retrieveComplete(hash);
    if (HasFailed(image))
      throw new NotFoundException('Image not found');

    res.type(image.mime);
    return image.data;
  }

  @Get('meta/:hash')
  async getImageMeta(@Param('hash') hash: string) {
    if (!isHash(hash, 'sha256')) throw new BadRequestException('Invalid hash');

    const image = await this.imagesService.retrieveInfo(hash);
    if (HasFailed(image))
      throw new NotFoundException('Image not found');

    return image;
  }

  @Post()
  async uploadImage(
    @Req() req: FastifyRequest,
    @MultiPart(ImageUploadDto) multipart: ImageUploadDto,
  ) {
    const fileBuffer = await multipart.image.toBuffer();
    const image = await this.imagesService.upload(fileBuffer);
    if (HasFailed(image)) {
      throw new InternalServerErrorException('Failed to upload image');
    }

    return image;
  }
}
