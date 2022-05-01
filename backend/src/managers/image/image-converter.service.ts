import { Injectable } from '@nestjs/common';
import { ImageRequestParams } from 'picsur-shared/dist/dto/api/image.dto';
import {
  FullMime, SupportedMimeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { AsyncFailable, Fail, HasFailed } from 'picsur-shared/dist/types';
import { SharpWrapper } from '../../workers/sharp.wrapper';
import { ImageResult } from './imageresult';

@Injectable()
export class ImageConverterService {
  public async convert(
    image: Buffer,
    sourcemime: FullMime,
    targetmime: FullMime,
    options: ImageRequestParams,
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
      return this.convertStill(image, sourcemime, targetmime, options);
    } else if (targetmime.type === SupportedMimeCategory.Animation) {
      return this.convertAnimation(image, targetmime, options);
    } else {
      return Fail('Unsupported mime type');
    }
  }

  private async convertStill(
    image: Buffer,
    sourcemime: FullMime,
    targetmime: FullMime,
    options: ImageRequestParams,
  ): AsyncFailable<ImageResult> {
    const sharpWrapper = new SharpWrapper();

    const hasStarted = await sharpWrapper.start(image, sourcemime);
    if (HasFailed(hasStarted)) return hasStarted;

    // Do modifications
    if (options.height || options.width) {
      if (options.height && options.width) {
        sharpWrapper.operation('resize', {
          width: options.width,
          height: options.height,
          fit: 'fill',
          kernel: 'cubic',
        });
      } else {
        sharpWrapper.operation('resize', {
          width: options.width,
          height: options.height,
          fit: 'contain',
          kernel: 'cubic',
        });
      }
    }
    if (options.rotate) {
      sharpWrapper.operation('rotate', options.rotate, {
        background: 'transparent',
      });
    }
    if (options.flipx) {
      sharpWrapper.operation('flop');
    }
    if (options.flipy) {
      sharpWrapper.operation('flip');
    }
    if (options.noalpha) {
      sharpWrapper.operation('removeAlpha');
    }
    if (options.negative) {
      sharpWrapper.operation('negate');
    }
    if (options.greyscale) {
      sharpWrapper.operation('greyscale');
    }

    // Export
    const result = await sharpWrapper.finish(targetmime, options);
    if (HasFailed(result)) return result;

    return {
      image: result.data,
      mime: targetmime.mime,
    };
  }

  private async convertAnimation(
    image: Buffer,
    targetmime: FullMime,
    options: ImageRequestParams,
  ): AsyncFailable<ImageResult> {
    // Apng and gif are stored as is for now
    return {
      image: image,
      mime: targetmime.mime,
    };
  }
}
