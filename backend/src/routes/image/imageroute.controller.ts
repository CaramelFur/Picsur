import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res
} from '@nestjs/common';
import { isHash } from 'class-validator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HasFailed } from 'picsur-shared/dist/types';
import { MultiPart } from '../../decorators/decorator';
import { ImageManagerService } from '../../managers/imagemanager/imagemanager.service';
import { ImageUploadDto } from '../../models/dto/imageroute.dto';
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
    if (HasFailed(image)) {
      console.warn(image.getReason());
      throw new NotFoundException('Could not find image');
    }

    res.type(image.mime);
    return image.data;
  }

  @Get('meta/:hash')
  async getImageMeta(@Param('hash') hash: string) {
    if (!isHash(hash, 'sha256')) throw new BadRequestException('Invalid hash');

    const image = await this.imagesService.retrieveInfo(hash);
    if (HasFailed(image)) {
      console.warn(image.getReason());
      throw new NotFoundException('Could not find image');
    }

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
      console.warn(image.getReason());
      throw new InternalServerErrorException('Could not upload image');
    }

    return image;
  }
}
