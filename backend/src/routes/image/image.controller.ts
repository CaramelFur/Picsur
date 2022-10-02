import { Controller, Get, Head, Logger, Query, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { FastifyReply } from 'fastify';
import {
  ImageMetaResponse,
  ImageRequestParams,
} from 'picsur-shared/dist/dto/api/image.dto';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { FileType2Mime } from 'picsur-shared/dist/dto/mimes.dto';
import { FT, IsFailure, ThrowIfFailed } from 'picsur-shared/dist/types';
import { UserDbService } from '../../collections/user-db/user-db.service';
import { ImageFullIdParam } from '../../decorators/image-id/image-full-id.decorator';
import { ImageIdParam } from '../../decorators/image-id/image-id.decorator';
import { RequiredPermissions } from '../../decorators/permissions.decorator';
import { Returns } from '../../decorators/returns.decorator';
import { ConvertService } from '../../managers/image/convert.service';
import { ImageManagerService } from '../../managers/image/image-manager.service';
import type { ImageFullId } from '../../models/constants/image-full-id.const';
import { Permission } from '../../models/constants/permissions.const';
import { EUserBackend2EUser } from '../../models/transformers/user.transformer';
import { BrandMessageType, GetBrandMessage } from '../../util/branding';

// This is the only controller with CORS enabled
@Controller('i')
@RequiredPermissions(Permission.ImageView)
@SkipThrottle()
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(
    private readonly imagesService: ImageManagerService,
    private readonly userService: UserDbService,
    private readonly convertService: ConvertService,
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
    try {
      if (fullid.variant === ImageEntryVariant.ORIGINAL) {
        const image = ThrowIfFailed(
          await this.imagesService.getOriginal(fullid.id),
        );
        const data = ThrowIfFailed(await this.imagesService.getData(image));

        res.type(ThrowIfFailed(FileType2Mime(image.filetype)));
        return data;
      }

      const image = ThrowIfFailed(
        await this.convertService.convertPromise(
          fullid.id,
          fullid.filetype,
          params,
        ),
      );
      const data = ThrowIfFailed(await this.imagesService.getData(image));

      res.type(ThrowIfFailed(FileType2Mime(image.filetype)));
      return data;
    } catch (e) {
      if (!IsFailure(e) || e.getType() !== FT.NotFound) throw e;

      const message = ThrowIfFailed(
        await GetBrandMessage(BrandMessageType.NotFound),
      );
      res.type(message.type);
      return message.data;
    }
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
