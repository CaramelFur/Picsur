import { Injectable } from '@nestjs/common';
import icoToPng from 'ico-to-png';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import sharp from 'sharp';
import { UsrPreferenceService } from '../../collections/preferencesdb/usrpreferencedb.service';
import {
  FullMime,
  ImageMime,
  SupportedMimeCategory
} from '../../models/dto/mimes.dto';

@Injectable()
export class ImageProcessorService {
  constructor(private readonly userPref: UsrPreferenceService) {}

  public async process(
    image: Buffer,
    mime: FullMime,
    userid: string,
  ): AsyncFailable<Buffer> {
    if (mime.type === SupportedMimeCategory.Image) {
      return await this.processStill(image, mime, {});
    } else if (mime.type === SupportedMimeCategory.Animation) {
      return await this.processAnimation(image, mime, {});
    } else {
      return Fail('Unsupported mime type');
    }

    // // nothing happens right now
    // const keepOriginal = await this.userPref.getBooleanPreference(
    //   userid,
    //   UsrPreference.KeepOriginal,
    // );
    // if (HasFailed(keepOriginal)) return keepOriginal;

    // if (keepOriginal) {
    // }
  }

  private async processStill(
    image: Buffer,
    mime: FullMime,
    options: {},
  ): AsyncFailable<Buffer> {
    let processedImage = image;

    switch (mime.mime) {
      case ImageMime.ICO:
        processedImage = await icoToPng(processedImage, 512);
        mime.mime = ImageMime.PNG;
        break;

      case ImageMime.BMP:
      case ImageMime.TIFF:
      case ImageMime.WEBP:
      case ImageMime.PNG:
      case ImageMime.JPEG:
        processedImage = await sharp(processedImage)
          .png({
            compressionLevel: 9,
            effort: 10,
          })
          .toBuffer();
        mime.mime = ImageMime.PNG;
        break;

      default:
        return Fail('Unsupported mime type');
    }

    return processedImage;
  }

  private async processAnimation(
    image: Buffer,
    mime: FullMime,
    options: {},
  ): AsyncFailable<Buffer> {
    // Apng and gif are stored as is for now
    return image;
  }
}
