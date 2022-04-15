import { Injectable } from '@nestjs/common';
import * as bmp from '@vingle/bmp-js';
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
  private readonly PngOptions = {
    compressionLevel: 9,
    effort: 10,
  };

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

    if (mime.mime === ImageMime.ICO) {
      processedImage = await icoToPng(processedImage, 512);
    } else if (mime.mime === ImageMime.BMP) {
      processedImage = await this.bmpSharp(processedImage)
        .png(this.PngOptions)
        .toBuffer();
    } else {
      processedImage = await sharp(processedImage)
        .png(this.PngOptions)
        .toBuffer();
    }
    mime.mime = ImageMime.PNG;

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

  private bmpSharp(image: Buffer) {
    const bitmap = bmp.decode(image, true);
    return sharp(bitmap.data, {
      raw: {
        width: bitmap.width,
        height: bitmap.height,
        channels: 4,
      },
    });
  }
}
