import { Injectable } from '@nestjs/common';
import * as bmp from '@vingle/bmp-js';
import decodeico from 'decode-ico';
import {
  FullMime,
  ImageMime,
  SupportedMimeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, Fail } from 'picsur-shared/dist/types';
import { QOIColorSpace, QOIdecode, QOIencode } from 'qoi-img';
import sharp from 'sharp';
import { UsrPreferenceService } from '../../collections/preference-db/usr-preference-db.service';

interface ProcessResult {
  image: Buffer;
  mime: string;
}

@Injectable()
export class ImageProcessorService {
  constructor(private readonly userPref: UsrPreferenceService) {}

  public async process(
    image: Buffer,
    mime: FullMime,
    userid: string,
  ): AsyncFailable<ProcessResult> {
    if (mime.type === SupportedMimeCategory.Image) {
      return await this.processStill(image, mime, {});
    } else if (mime.type === SupportedMimeCategory.Animation) {
      return await this.processAnimation(image, mime, {});
    } else {
      return Fail('Unsupported mime type');
    }
  }

  private async processStill(
    image: Buffer,
    mime: FullMime,
    options: {},
  ): AsyncFailable<ProcessResult> {
    let processedMime = mime.mime;
    let sharpImage: sharp.Sharp;

    // TODO: ensure mime and sharp are in agreement
    if (mime.mime === ImageMime.ICO) {
      sharpImage = this.icoSharp(image);
    } else if (mime.mime === ImageMime.BMP) {
      sharpImage = this.bmpSharp(image);
    } else if (mime.mime === ImageMime.QOI) {
      sharpImage = this.qoiSharp(image);
    } else {
      sharpImage = sharp(image);
    }
    processedMime = ImageMime.QOI;

    sharpImage = sharpImage.toColorspace('srgb');

    const metadata = await sharpImage.metadata();
    const pixels = await sharpImage.raw().toBuffer();

    if (
      metadata.hasAlpha === undefined ||
      metadata.width === undefined ||
      metadata.height === undefined
    )
      return Fail('Invalid image');

    if (metadata.width >= 32768 || metadata.height >= 32768) {
      return Fail('Image too large');
    }

    // Png can be more efficient than QOI, but its just sooooooo slow
    const qoiImage = QOIencode(pixels, {
      channels: metadata.hasAlpha ? 4 : 3,
      colorSpace: QOIColorSpace.SRGB,
      height: metadata.height,
      width: metadata.width,
    });

    return {
      image: qoiImage,
      mime: processedMime,
    };
  }

  private async processAnimation(
    image: Buffer,
    mime: FullMime,
    options: {},
  ): AsyncFailable<ProcessResult> {
    // Apng and gif are stored as is for now
    return {
      image: image,
      mime: mime.mime,
    };
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

  private qoiSharp(image: Buffer) {
    const result = QOIdecode(image);

    return sharp(result.pixels, {
      raw: {
        width: result.width,
        height: result.height,
        channels: result.channels,
      },
    });
  }
}
