import { Injectable } from '@nestjs/common';
import {
  FullMime,
  ImageMime,
  SupportedMimeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { QOIColorSpace, QOIencode } from 'qoi-img';
import { ImageResult } from './imageresult';
import { UniversalSharp } from './universal-sharp';

@Injectable()
export class ImageProcessorService {
  public async process(
    image: Buffer,
    mime: FullMime,
  ): AsyncFailable<ImageResult> {
    if (mime.type === SupportedMimeCategory.Image) {
      return await this.processStill(image, mime);
    } else if (mime.type === SupportedMimeCategory.Animation) {
      return await this.processAnimation(image, mime);
    } else {
      return Fail('Unsupported mime type');
    }
  }

  private async processStill(
    image: Buffer,
    mime: FullMime,
  ): AsyncFailable<ImageResult> {
    let processedMime = mime.mime;

    let sharpImage = UniversalSharp(image, mime);
    processedMime = ImageMime.QOI;

    sharpImage = sharpImage.toColorspace('srgb');

    const processedImage = await sharpImage.raw().toBuffer({
      resolveWithObject: true,
    });

    if (
      processedImage.info.width >= 32768 ||
      processedImage.info.height >= 32768
    ) {
      return Fail('Image too large');
    }

    // Png can be more efficient than QOI, but its just sooooooo slow
    const qoiImage = QOIencode(processedImage.data, {
      channels: processedImage.info.channels,
      colorspace: QOIColorSpace.SRGB,
      height: processedImage.info.height,
      width: processedImage.info.width,
    });

    return {
      image: qoiImage,
      mime: processedMime,
    };
  }

  private async processAnimation(
    image: Buffer,
    mime: FullMime,
  ): AsyncFailable<ImageResult> {
    // Apng and gif are stored as is for now
    return {
      image: image,
      mime: mime.mime,
    };
  }
}
