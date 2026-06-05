import { Controller, Get, Head, Logger, Query, Res } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { FastifyReply } from 'fastify';
import {
  ImageMetaResponse,
  ImageRequestParams,
} from 'picsur-shared/dist/dto/api/image.dto';
import { ImageEntryVariant } from 'picsur-shared/dist/dto/image-entry-variant.enum';
import { FileType2Mime, ImageFileType } from 'picsur-shared/dist/dto/mimes.dto';
import {
  FT,
  IsFailure,
  ThrowIfFailed,
} from 'picsur-shared/dist/types/failable';
import { UserDbService } from '../../collections/user-db/user-db.service.js';
import { ImageFullIdParam } from '../../decorators/image-id/image-full-id.decorator.js';
import { ImageIdParam } from '../../decorators/image-id/image-id.decorator.js';
import { RequiredPermissions } from '../../decorators/permissions.decorator.js';
import { Returns } from '../../decorators/returns.decorator.js';
import { ImageManagerService } from '../../managers/image/image.service.js';
import type { ImageFullId } from '../../models/constants/image-full-id.const.js';
import { Permission } from '../../models/constants/permissions.const.js';
import { EUserBackend2EUser } from '../../models/transformers/user.transformer.js';
import { BrandMessageType, GetBrandMessage } from '../../util/branding.js';

const SvgContentSecurityPolicy = [
  'sandbox',
  "default-src 'none'",
  "base-uri 'none'",
  "child-src 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "script-src 'none'",
].join('; ');

// This is the only controller with CORS enabled
@Controller('i')
@RequiredPermissions(Permission.ImageView)
@SkipThrottle()
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(
    private readonly imagesService: ImageManagerService,
    private readonly userService: UserDbService,
  ) {}

  @Head(':id')
  async headImage(
    @Res({ passthrough: true }) res: FastifyReply,
    @ImageFullIdParam() fullid: ImageFullId,
  ) {
    if (fullid.variant === ImageEntryVariant.ORIGINAL) {
      const filetype = ThrowIfFailed(
        await this.getOriginalDownloadFileType(fullid.id),
      );

      this.setImageResponseHeaders(res, filetype.identifier);
      res.type(ThrowIfFailed(FileType2Mime(filetype.identifier)));
      return;
    }

    this.setImageResponseHeaders(res, fullid.filetype);
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
        const image = ThrowIfFailed(await this.getOriginalDownload(fullid.id));

        this.setImageResponseHeaders(res, image.filetype);
        res.type(ThrowIfFailed(FileType2Mime(image.filetype)));
        return image.data;
      }

      const image = ThrowIfFailed(
        await this.imagesService.getConverted(
          fullid.id,
          fullid.filetype,
          params,
        ),
      );

      this.setImageResponseHeaders(res, image.filetype);
      res.type(ThrowIfFailed(FileType2Mime(image.filetype)));
      return image.data;
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

  private setImageResponseHeaders(res: FastifyReply, filetype: string) {
    if (filetype !== ImageFileType.SVG) return;

    res.header('Content-Security-Policy', SvgContentSecurityPolicy);
    res.header('X-Content-Type-Options', 'nosniff');
  }

  private async getOriginalDownload(imageId: string) {
    const original = await this.imagesService.getOriginal(imageId);
    if (!IsFailure(original) || original.getType() !== FT.NotFound) {
      return original;
    }

    const master = await this.imagesService.getMaster(imageId);
    if (IsFailure(master)) return master;

    if (master.filetype !== ImageFileType.SVG) return original;

    return master;
  }

  private async getOriginalDownloadFileType(imageId: string) {
    const original = await this.imagesService.getOriginalFileType(imageId);
    if (!IsFailure(original) || original.getType() !== FT.NotFound) {
      return original;
    }

    const master = await this.imagesService.getMasterFileType(imageId);
    if (IsFailure(master)) return master;

    if (master.identifier !== ImageFileType.SVG) return original;

    return master;
  }
}
