import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { FastifyReply } from 'fastify';
import {
  ImageDeleteRequest,
  ImageDeleteResponse,
  ImageDeleteWithKeyRequest,
  ImageDeleteWithKeyResponse,
  ImageListRequest,
  ImageListResponse,
  ImagesProgressRequest,
  ImagesProgressResponse,
  ImagesUploadResponse,
  ImageUpdateRequest,
  ImageUpdateResponse,
  ImageUploadResponse,
} from 'picsur-shared/dist/dto/api/image-manage.dto';
import { Permission } from 'picsur-shared/dist/dto/permissions.enum';
import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { Fail, FT, HasFailed, ThrowIfFailed } from 'picsur-shared/dist/types';
import { EImageBackend } from '../../database/entities/images/image.entity';
import { PostFiles } from '../../decorators/multipart/multipart.decorator';
import type { FileIterator } from '../../decorators/multipart/postfiles.pipe';
import {
  HasPermission,
  RequiredPermissions,
} from '../../decorators/permissions.decorator';
import { ReqUserID } from '../../decorators/request-user.decorator';
import { Returns, ReturnsAnything } from '../../decorators/returns.decorator';
import { ImageManagerService } from '../../managers/image/image-manager.service';
import { IngestService } from '../../managers/image/ingest.service';
import { GetNextAsync } from '../../util/iterator';
@Controller('api/image')
@RequiredPermissions(Permission.ImageUpload)
export class ImageManageController {
  private readonly logger = new Logger(ImageManageController.name);

  constructor(
    private readonly imagesService: ImageManagerService,
    private readonly ingestService: IngestService,
  ) {}

  @Post('upload')
  @Returns(ImageUploadResponse)
  @Throttle(20)
  async uploadImage(
    @PostFiles(1) multipart: FileIterator,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageDeleteKey) withDeleteKey: boolean,
  ): Promise<ImageUploadResponse> {
    const file = ThrowIfFailed(await GetNextAsync(multipart));

    let buffer: Buffer;
    try {
      buffer = await file.toBuffer();
    } catch (e) {
      throw Fail(FT.Internal, e);
    }

    const image = ThrowIfFailed(
      await this.ingestService.uploadPromise(
        userid,
        file.filename,
        buffer,
        withDeleteKey,
      ),
    );

    return image;
  }

  @Post('upload/bulk')
  @Returns(ImagesUploadResponse)
  @Throttle(20)
  async uploadImages(
    @PostFiles() multipart: FileIterator,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageDeleteKey) withDeleteKey: boolean,
  ): Promise<ImagesUploadResponse> {
    let jobs: {
      job_id: string;
      image: EImage;
    }[] = [];
    for await (const file of multipart) {
      const buffer = await file.toBuffer();
      const filename = file.filename;

      const [job, image] = ThrowIfFailed(
        await this.ingestService.uploadJob(
          userid,
          filename,
          buffer,
          withDeleteKey,
        ),
      );

      jobs.push({
        job_id: job.id.toString(),
        image: image,
      });
    }
    if (jobs.length === 0) {
      throw Fail(FT.BadRequest, 'No files uploaded');
    }

    return {
      count: jobs.length,
      results: jobs,
    };
  }

  @Post('upload/status')
  @Returns(ImagesProgressResponse)
  async getImagesProgress(
    @Body() body: ImagesProgressRequest,
  ): Promise<ImagesProgressResponse> {
    return ThrowIfFailed(await this.ingestService.getProgress(body.job_ids));
  }

  @Post('list')
  @RequiredPermissions(Permission.ImageManage)
  @Returns(ImageListResponse)
  async listMyImagesPaged(
    @Body() body: ImageListRequest,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageAdmin) isImageAdmin: boolean,
  ): Promise<ImageListResponse> {
    if (!isImageAdmin) {
      body.user_id = userid;
    }

    const found = ThrowIfFailed(
      await this.imagesService.findMany(body.count, body.page, body.user_id),
    );

    return found;
  }

  @Post('update')
  @RequiredPermissions(Permission.ImageManage)
  @Returns(ImageUpdateResponse)
  async updateImage(
    @Body() body: ImageUpdateRequest,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageAdmin) isImageAdmin: boolean,
  ): Promise<ImageUpdateResponse> {
    const user_id = isImageAdmin ? undefined : userid;

    const image = ThrowIfFailed(
      await this.imagesService.update(body.id, user_id, body),
    );

    return image;
  }

  @Post('delete')
  @RequiredPermissions(Permission.ImageManage)
  @Returns(ImageDeleteResponse)
  async deleteImage(
    @Body() body: ImageDeleteRequest,
    @ReqUserID() userid: string,
    @HasPermission(Permission.ImageAdmin) isImageAdmin: boolean,
  ): Promise<ImageDeleteResponse> {
    const deletedImages = ThrowIfFailed(
      await this.imagesService.deleteMany(
        body.ids,
        isImageAdmin ? undefined : userid,
      ),
    );

    return {
      images: deletedImages,
    };
  }

  @Post('delete/key')
  @RequiredPermissions(Permission.ImageDeleteKey)
  @Returns(ImageDeleteWithKeyResponse)
  async deleteImageWithKeyGet(
    @Body() body: ImageDeleteWithKeyRequest,
  ): Promise<ImageDeleteWithKeyResponse> {
    return ThrowIfFailed(
      await this.imagesService.deleteWithKey(body.id, body.key),
    );
  }

  @Get('delete/:id/:key')
  @RequiredPermissions(Permission.ImageDeleteKey)
  async deleteImageWithKeyPost(
    @Param() params: ImageDeleteWithKeyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<string> {
    const image = await this.imagesService.deleteWithKey(params.id, params.key);
    if (HasFailed(image)) {
      res.header('Location', '/error/delete-failure');
      res.code(302);
      return 'Failed to delete image';
    }

    res.header('Location', '/error/delete-success');
    res.code(302);
    return 'Successsfully deleted image';
  }
}
