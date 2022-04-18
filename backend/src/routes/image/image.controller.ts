import {
  Controller,
  Get,
  Head,
  InternalServerErrorException,
  Logger,
  NotFoundException, Post,
  Res
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ImageMetaResponse } from 'picsur-shared/dist/dto/api/image.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { ImageIdParam } from '../../decorators/image-id/image-id.decorator';
import { MultiPart } from '../../decorators/multipart/multipart.decorator';
import { RequiredPermissions } from '../../decorators/permissions.decorator';
import { ReqUserID } from '../../decorators/request-user.decorator';
import { Returns } from '../../decorators/returns.decorator';
import { ImageManagerService } from '../../managers/image/image.service';
import { Permission } from '../../models/constants/permissions.const';
import { ImageUploadDto } from '../../models/dto/image-upload.dto';
import { EImageBackend2EImage } from '../../models/transformers/image.transformer';

// This is the only controller with CORS enabled
@Controller('i')
@RequiredPermissions(Permission.ImageView)
export class ImageController {
  private readonly logger = new Logger('ImageController');

  constructor(private readonly imagesService: ImageManagerService) {}

  @Get(':id')
  async getImage(
    // Usually passthrough is for manually sending the response,
    // But we need it here to set the mime type
    @Res({ passthrough: true }) res: FastifyReply,
    @ImageIdParam() id: string,
  ): Promise<Buffer> {
    const image = await this.imagesService.retrieveComplete(id);
    if (HasFailed(image)) {
      this.logger.warn(image.getReason());
      throw new NotFoundException('Could not find image');
    }

    res.type(image.mime);
    return image.data;
  }

  @Head(':id')
  async headImage(
    @Res({ passthrough: true }) res: FastifyReply,
    @ImageIdParam() id: string,
  ) {
    const image = await this.imagesService.retrieveInfo(id);
    if (HasFailed(image)) {
      this.logger.warn(image.getReason());
      throw new NotFoundException('Could not find image');
    }

    res.type(image.mime);
  }

  @Get('meta/:id')
  @Returns(ImageMetaResponse)
  async getImageMeta(
    @ImageIdParam() id: string,
  ): Promise<ImageMetaResponse> {
    const image = await this.imagesService.retrieveInfo(id);
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
    @ReqUserID() userid: string,
  ): Promise<ImageMetaResponse> {
    const fileBuffer = await multipart.image.toBuffer();
    const image = await this.imagesService.upload(fileBuffer, userid);
    if (HasFailed(image)) {
      this.logger.warn(image.getReason());
      throw new InternalServerErrorException('Could not upload image');
    }

    return EImageBackend2EImage(image);
  }
}
