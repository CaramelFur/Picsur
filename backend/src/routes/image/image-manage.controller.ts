import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post
} from '@nestjs/common';
import {
  ImageDeleteRequest,
  ImageDeleteResponse,
  ImageListRequest,
  ImageListResponse,
  ImageUploadResponse
} from 'picsur-shared/dist/dto/api/image-manage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.dto';
import { HasFailed } from 'picsur-shared/dist/types';
import { MultiPart } from '../../decorators/multipart/multipart.decorator';
import {
  HasPermission,
  RequiredPermissions
} from '../../decorators/permissions.decorator';
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

  @Post('list')
  @Returns(ImageListResponse)
  async listMyImagesPaged(
    @Body() body: ImageListRequest,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageAdmin) isImageAdmin: boolean,
  ): Promise<ImageListResponse> {
    if (!isImageAdmin) {
      body.user_id = userid;
    }

    const images = await this.imagesService.findMany(
      body.count,
      body.page,
      body.user_id,
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

  @Post('delete')
  @Returns(ImageDeleteResponse)
  async deleteImage(
    @Body() body: ImageDeleteRequest,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageAdmin) isImageAdmin: boolean,
  ): Promise<ImageDeleteResponse> {
    const deletedImages = await this.imagesService.deleteMany(
      body.ids,
      isImageAdmin ? undefined : userid,
    );
    if (HasFailed(deletedImages)) {
      this.logger.warn(deletedImages.getReason());
      throw new BadRequestException('Could not delete images');
    }

    return {
      images: deletedImages,
      count: deletedImages.length,
    };
  }
}
