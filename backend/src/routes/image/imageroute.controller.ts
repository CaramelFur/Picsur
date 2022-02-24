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
import { HasFailed } from 'imagur-shared/dist/types';
import { MultiPart } from '../../decorators/multipart.decorator';
import { ImageManagerService } from '../../managers/imagemanager/imagemanager.service';
import { ImageUploadDto } from './imageroute.dto';
@Controller('i')
export class ImageController {
  constructor(private readonly imagesService: ImageManagerService) {}

  @Get(':hash')
  async getImage(
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('hash') hash: string,
  ) {
    if (!this.imagesService.validateHash(hash))
      throw new BadRequestException('Invalid hash');

    const image = await this.imagesService.retrieve(hash);
    if (HasFailed(image))
      throw new NotFoundException('Failed to retrieve image');

    res.type(image.mime);
    return image.data;
  }

  @Post()
  async uploadImage(
    @Req() req: FastifyRequest,
    @MultiPart(ImageUploadDto) multipart: ImageUploadDto,
  ) {
    const fileBuffer = await multipart.image.toBuffer();
    const hash = await this.imagesService.upload(fileBuffer);
    if (HasFailed(hash)) {
      throw new InternalServerErrorException('Failed to upload image');
    }

    return { hash };
  }
}
