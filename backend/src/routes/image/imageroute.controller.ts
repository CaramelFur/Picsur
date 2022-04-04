import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Res
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ImageMetaResponse } from 'picsur-shared/dist/dto/api/image.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { MultiPart } from '../../decorators/multipart.decorator';
import { RequiredPermissions } from '../../decorators/permissions.decorator';
import { Returns } from '../../decorators/returns.decorator';
import { ImageManagerService } from '../../managers/imagemanager/imagemanager.service';
import { Permission } from '../../models/dto/permissions.dto';
import {
  ImageUploadDto
} from '../../models/requests/imageroute.dto';
import { EImageBackend2EImage } from '../../models/transformers/image.transformer';
import { ImageIdValidator } from './imageid.validator';

// This is the only controller with CORS enabled
@Controller('i')
@RequiredPermissions(Permission.ImageView)
export class ImageController {
  private readonly logger = new Logger('ImageController');

  constructor(private readonly imagesService: ImageManagerService) {}

  @Get(':hash')
  async getImage(
    // Usually passthrough is for manually sending the response,
    // But we need it here to set the mime type
    @Res({ passthrough: true }) res: FastifyReply,
    @Param('hash', ImageIdValidator) hash: string,
  ): Promise<Buffer> {
    const image = await this.imagesService.retrieveComplete(hash);
    if (HasFailed(image)) {
      this.logger.warn(image.getReason());
      throw new NotFoundException('Could not find image');
    }

    res.type(image.mime);
    return image.data;
  }

  @Get('meta/:hash')
  @Returns(ImageMetaResponse)
  async getImageMeta(
    @Param('hash', ImageIdValidator) hash: string,
  ): Promise<ImageMetaResponse> {
    const image = await this.imagesService.retrieveInfo(hash);
    if (HasFailed(image)) {
      this.logger.warn(image.getReason());
      throw new NotFoundException('Could not find image');
    }

    return EImageBackend2EImage(image);
  }

  @Post()
  @Returns(ImageMetaResponse)
  @RequiredPermissions(Permission.ImageUpload)
  async uploadImage(
    @MultiPart() multipart: ImageUploadDto,
  ): Promise<ImageMetaResponse> {
    const fileBuffer = await multipart.image.toBuffer();
    const image = await this.imagesService.upload(fileBuffer);
    if (HasFailed(image)) {
      this.logger.warn(image.getReason());
      throw new InternalServerErrorException('Could not upload image');
    }

    return EImageBackend2EImage(image);
  }
}
