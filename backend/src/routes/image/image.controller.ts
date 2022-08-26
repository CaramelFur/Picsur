import {
  Controller,
  Get,
  Head, Logger, Query,
  Res
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {
  ImageMetaResponse,
  ImageRequestParams
} from 'picsur-shared/dist/dto/api/image.dto';
import { ThrowIfFailed } from 'picsur-shared/dist/types';
import { UsersService } from '../../collections/user-db/user-db.service';
import { ImageFullIdParam } from '../../decorators/image-id/image-full-id.decorator';
import { ImageIdParam } from '../../decorators/image-id/image-id.decorator';
import { RequiredPermissions } from '../../decorators/permissions.decorator';
import { Returns } from '../../decorators/returns.decorator';
import { ImageManagerService } from '../../managers/image/image.service';
import type { ImageFullId } from '../../models/constants/image-full-id.const';
import { Permission } from '../../models/constants/permissions.const';
import { EUserBackend2EUser } from '../../models/transformers/user.transformer';

// This is the only controller with CORS enabled
@Controller('i')
@RequiredPermissions(Permission.ImageView)
export class ImageController {
  private readonly logger = new Logger('ImageController');

  constructor(
    private readonly imagesService: ImageManagerService,
    private readonly userService: UsersService,
  ) {}

  @Head(':id')
  async headImage(
    @Res({ passthrough: true }) res: FastifyReply,
    @ImageFullIdParam() fullid: ImageFullId,
  ) {
    if (fullid.type === 'original') {
      const fullmime = ThrowIfFailed(
        await this.imagesService.getOriginalMime(fullid.id),
      );

      res.type(fullmime.mime);
      return;
    }

    res.type(fullid.mime);
  }

  @Get(':id')
  async getImage(
    // Usually passthrough is for manually sending the response,
    // But we need it here to set the mime type
    @Res({ passthrough: true }) res: FastifyReply,
    @ImageFullIdParam() fullid: ImageFullId,
    @Query() params: ImageRequestParams,
  ): Promise<Buffer> {
    if (fullid.type === 'original') {
      const image = ThrowIfFailed(
        await this.imagesService.getOriginal(fullid.id),
      );

      res.type(image.mime);
      return image.data;
    }

    const image = ThrowIfFailed(
      await this.imagesService.getConverted(fullid.id, fullid.mime, params),
    );

    res.type(image.mime);
    return image.data;
  }

  @Get('meta/:id')
  @Returns(ImageMetaResponse)
  async getImageMeta(@ImageIdParam() id: string): Promise<ImageMetaResponse> {
    const image = ThrowIfFailed(await this.imagesService.findOne(id));

    const [fileMimesRes, imageUserRes] = await Promise.all([
      this.imagesService.getFileMimes(id),
      this.userService.findOne(image.user_id),
    ])

    const fileMimes = ThrowIfFailed(fileMimesRes);
    const imageUser = ThrowIfFailed(imageUserRes);

    return { image, user: EUserBackend2EUser(imageUser), fileMimes };
  }
}
