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
import { PostFile } from 'src/decorators/multipart.decorator';
import { ImageManagerService } from 'src/managers/imagemanager/imagemanager.service';
import { HasFailed } from 'src/types/failable';

@Controller()
export class ImageController {
  constructor(private readonly imagesService: ImageManagerService) {}

  @Get('i/:hash')
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

  @Post('i')
  async uploadImage(@Req() req: FastifyRequest, @PostFile() file: Buffer) {
    const hash = await this.imagesService.upload(file);
    if (HasFailed(hash)) {
      throw new InternalServerErrorException('Failed to upload image');
    }

    return { hash };
  }
}
