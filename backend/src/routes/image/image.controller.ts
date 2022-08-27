import { Controller, Get, Head, Logger, Query, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {
  ImageMetaResponse,
  ImageRequestParams
} from 'picsur-shared/dist/dto/api/image.dto';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { FileType2Mime } from 'picsur-shared/dist/dto/mimes.dto';
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
    if (fullid.variant === ImageEntryVariant.ORIGINAL) {
      const filetype = ThrowIfFailed(
        await this.imagesService.getOriginalFileType(fullid.id),
      );

      res.type(ThrowIfFailed(FileType2Mime(filetype.identifier)));
      return;
    }

    res.type(ThrowIfFailed(FileType2Mime(fullid.filetype)));
  }

  @Get(':id')
  async getImage(
    // Usually passthrough is for manually sending the response,
    // But we need it here to set the mime type
    @Res({ passthrough: true }) res: FastifyReply,
    @ImageFullIdParam() fullid: ImageFullId,
    @Query() params: ImageRequestParams,
  ): Promise<Buffer> {
    if (fullid.variant === ImageEntryVariant.ORIGINAL) {
      const image = ThrowIfFailed(
        await this.imagesService.getOriginal(fullid.id),
      );

      res.type(ThrowIfFailed(FileType2Mime(image.filetype)));
      return image.data;
    }

    const image = ThrowIfFailed(
      await this.imagesService.getConverted(fullid.id, fullid.filetype, params),
    );

    res.type(ThrowIfFailed(FileType2Mime(image.filetype)));
    return image.data;
  }

  @Get('meta/:id')
  @Returns(ImageMetaResponse)
  async getImageMeta(@ImageIdParam() id: string): Promise<ImageMetaResponse> {
    const image = ThrowIfFailed(await this.imagesService.findOne(id));

    const [fileMimesRes, imageUserRes] = await Promise.all([
      this.imagesService.getFileMimes(id),
      this.userService.findOne(image.user_id),
    ]);

    const fileTypes = ThrowIfFailed(fileMimesRes);
    const imageUser = ThrowIfFailed(imageUserRes);

    return { image, user: EUserBackend2EUser(imageUser), fileTypes };
  }
}
