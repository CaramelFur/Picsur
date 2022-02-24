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
import {
  IsBoolean,
  IsDefined,
  Validate,
  ValidateNested,
} from 'class-validator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from 'src/collections/userdb/user.dto';
import { MultiPart, MultiPartDto } from 'src/decorators/multipart.decorator';
import { MultiPartFileDto } from 'src/decorators/multipart.dto';
import { ImageManagerService } from 'src/managers/imagemanager/imagemanager.service';
import { HasFailed } from 'src/types/failable';
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
