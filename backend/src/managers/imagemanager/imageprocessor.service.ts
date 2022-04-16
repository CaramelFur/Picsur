import { Injectable } from '@nestjs/common';
import * as bmp from '@vingle/bmp-js';
import decodeico from 'decode-ico';
import {
  FullMime,
  ImageMime,
  SupportedMimeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { QOIColorSpace, QOIencode } from 'qoi-img';
import sharp from 'sharp';
import { UsrPreferenceService } from '../../collections/preferencesdb/usrpreferencedb.service';

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
    let sharpImage: sharp.Sharp;

    if (mime.mime === ImageMime.ICO) {
      sharpImage = this.icoSharp(image);
    } else if (mime.mime === ImageMime.BMP) {
      sharpImage = this.bmpSharp(image);
    } else {
      sharpImage = sharp(image);
    }
    mime.mime = ImageMime.PNG;

    sharpImage = sharpImage.toColorspace('srgb');

    const metadata = await sharpImage.metadata();
    const pixels = await sharpImage.raw().toBuffer();

    if (
      metadata.hasAlpha === undefined ||
      metadata.width === undefined ||
      metadata.height === undefined
    )
      return Fail('Invalid image');

    // Png can be more efficient than QOI, but its just sooooooo slow
    const qoiImage = QOIencode(pixels, {
      channels: metadata.hasAlpha ? 4 : 3,
      colorSpace: QOIColorSpace.SRGB,
      height: metadata.height,
      width: metadata.width,
    });

    return qoiImage;
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

  private icoSharp(image: Buffer) {
    const result = decodeico(image);
    // Get biggest image
    const best = result.sort((a, b) => b.width - a.width)[0];

    return sharp(best.data, {
      raw: {
        width: best.width,
        height: best.height,
        channels: 4,
      },
    });
  }
}
