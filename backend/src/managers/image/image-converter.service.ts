import { Injectable } from '@nestjs/common';
import { BMPencode } from 'bmp-img';
import {
  FullMime,
  ImageMime,
  SupportedMimeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { QOIencode } from 'qoi-img';
import { Sharp } from 'sharp';
import { ImageResult } from './imageresult';
import { UniversalSharp } from './universal-sharp';

@Injectable()
export class ImageConverterService {
  public async convert(
    image: Buffer,
    sourcemime: FullMime,
    targetmime: FullMime,
  ): AsyncFailable<ImageResult> {
    if (sourcemime.type !== targetmime.type) {
      return Fail("Can't convert from animated to still or vice versa");
    }

    if (sourcemime.mime === targetmime.mime) {
      return {
        mime: targetmime.mime,
        image,
      };
    }

    if (targetmime.type === SupportedMimeCategory.Image) {
      return this.convertStill(image, sourcemime, targetmime);
    } else if (targetmime.type === SupportedMimeCategory.Animation) {
      return this.convertAnimation(image, targetmime);
    } else {
      return Fail('Unsupported mime type');
    }
  }

  private async convertStill(
    image: Buffer,
    sourcemime: FullMime,
    targetmime: FullMime,
  ): AsyncFailable<ImageResult> {
    const sharpImage = UniversalSharp(image, sourcemime);

    // Do modifications

    // Export
    let result: Buffer;

    try {
      switch (targetmime.mime) {
        case ImageMime.PNG:
          result = await sharpImage.png().toBuffer();
          break;
        case ImageMime.JPEG:
          result = await sharpImage.jpeg().toBuffer();
          break;
        case ImageMime.TIFF:
          result = await sharpImage.tiff().toBuffer();
          break;
        case ImageMime.WEBP:
          result = await sharpImage.webp().toBuffer();
          break;
        case ImageMime.BMP:
          result = await this.sharpToBMP(sharpImage);
          break;
        case ImageMime.QOI:
          result = await this.sharpToQOI(sharpImage);
          break;
        default:
          throw new Error('Unsupported mime type');
      }
    } catch (e) {
      return Fail(e);
    }

    return {
      image: result,
      mime: targetmime.mime,
    };
  }

  private async convertAnimation(
    image: Buffer,
    targetmime: FullMime,
  ): AsyncFailable<ImageResult> {
    // Apng and gif are stored as is for now
    return {
      image: image,
      mime: targetmime.mime,
    };
  }

  private async sharpToBMP(sharpImage: Sharp): Promise<Buffer> {
    const dimensions = await sharpImage.metadata();
    if (!dimensions.width || !dimensions.height || !dimensions.channels) {
      throw new Error('Invalid image');
    }

    const raw = await sharpImage.raw().toBuffer();

    const encoded = BMPencode(raw, {
      width: dimensions.width,
      height: dimensions.height,
      channels: dimensions.channels,
    });

    return encoded;
  }

  private async sharpToQOI(sharpImage: Sharp): Promise<Buffer> {
    const dimensions = await sharpImage.metadata();
    if (!dimensions.width || !dimensions.height || !dimensions.channels) {
      throw new Error('Invalid image');
    }

    const raw = await sharpImage.raw().toBuffer();

    const encoded = QOIencode(raw, {
      height: dimensions.height,
      width: dimensions.width,
      channels: dimensions.channels,
    });

    return encoded;
  }
}
