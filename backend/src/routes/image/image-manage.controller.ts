import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import { PagedRequest } from 'picsur-shared/dist/dto/api/common.dto';
import { ImageListResponse, ImageUploadResponse } from 'picsur-shared/dist/dto/api/image-manage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { MultiPart } from '../../decorators/multipart/multipart.decorator';
import { RequiredPermissions } from '../../decorators/permissions.decorator';
import { ReqUserID } from '../../decorators/request-user.decorator';
import { Returns } from '../../decorators/returns.decorator';
import { ImageManagerService } from '../../managers/image/image.service';
import { ImageUploadDto } from '../../models/dto/image-upload.dto';

@Controller('api/image')
@RequiredPermissions(Permission.ImageUpload)
export class ImageManageController {
  private readonly logger = new Logger('ImageManageController');

  constructor(private readonly imagesService: ImageManagerService) {}

  @Post('upload')
  @Returns(ImageUploadResponse)
  async uploadImage(
    @MultiPart() multipart: ImageUploadDto,
    @ReqUserID() userid: string,
  ): Promise<ImageUploadResponse> {
    const image = await this.imagesService.upload(
      multipart.image.buffer,
      userid,
    );
    if (HasFailed(image)) {
      this.logger.warn(image.getReason(), image.getStack());
      throw new InternalServerErrorException('Could not upload image');
    }

    return image;
  }

  @Post('my/list')
  @Returns(ImageListResponse)
  async listUsersPaged(
    @Body() body: PagedRequest,
    @ReqUserID() userid: string,
  ): Promise<ImageListResponse> {
    const images = await this.imagesService.findMany(
      body.count,
      body.page,
      userid,
    );
    if (HasFailed(images)) {
      this.logger.warn(images.getReason());
      throw new InternalServerErrorException('Could not list images');
    }

    return {
      images,
      count: images.length,
      page: body.page,
    };
  }
}
