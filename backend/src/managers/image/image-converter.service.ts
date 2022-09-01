import { Injectable } from '@nestjs/common';
import ms from 'ms';
import { ImageRequestParams } from 'picsur-shared/dist/dto/api/image.dto';
import {
  FileType,
  SupportedFileTypeCategory
} from 'picsur-shared/dist/dto/mimes.dto';
import { SysPreference } from 'picsur-shared/dist/dto/sys-preferences.enum';
import { AsyncFailable, Fail, FT, HasFailed } from 'picsur-shared/dist/types';
import { SharpOptions } from 'sharp';
import { SysPreferenceService } from '../../collections/preference-db/sys-preference-db.service';
import { SharpWrapper } from '../../workers/sharp.wrapper';
import { ImageResult } from './imageresult';

@Injectable()
export class ImageConverterService {
  constructor(private readonly sysPref: SysPreferenceService) {}

  public async convert(
    image: Buffer,
    sourceFiletype: FileType,
    targetFiletype: FileType,
    options: ImageRequestParams,
  ): AsyncFailable<ImageResult> {
    if (
      sourceFiletype.identifier === targetFiletype.identifier &&
      Object.keys(options).length === 0
    ) {
      return {
        filetype: targetFiletype.identifier,
        image,
      };
    }

    if (targetFiletype.category === SupportedFileTypeCategory.Image) {
      return this.convertStill(image, sourceFiletype, targetFiletype, options);
    } else if (
      targetFiletype.category === SupportedFileTypeCategory.Animation
    ) {
      return this.convertStill(image, sourceFiletype, targetFiletype, options);
      //return this.convertAnimation(image, targetmime, options);
    } else {
      return Fail(FT.SysValidation, 'Unsupported mime type');
    }
  }

  private async convertStill(
    image: Buffer,
    sourceFiletype: FileType,
    targetFiletype: FileType,
    options: ImageRequestParams,
  ): AsyncFailable<ImageResult> {
    const [memLimit, timeLimit] = await Promise.all([
      this.sysPref.getNumberPreference(SysPreference.ConversionMemoryLimit),
      this.sysPref.getStringPreference(SysPreference.ConversionTimeLimit),
    ]);
    if (HasFailed(memLimit) || HasFailed(timeLimit)) {
      return Fail(FT.Internal, 'Failed to get conversion limits');
    }
    const timeLimitMS = ms(timeLimit);

    const sharpWrapper = new SharpWrapper(timeLimitMS, memLimit);
    const sharpOptions: SharpOptions = {
      animated: targetFiletype.category === SupportedFileTypeCategory.Animation,
    };
    const hasStarted = await sharpWrapper.start(
      image,
      sourceFiletype,
      sharpOptions,
    );
    if (HasFailed(hasStarted)) return hasStarted;

    // Do modifications
    if (options.height || options.width) {
      if ((options.height && options.width)) {
        sharpWrapper.operation('resize', {
          width: options.width,
          height: options.height,
          fit: 'fill',
          kernel: 'cubic',
          withoutEnlargement: options.shrinkonly,
        });
      } else {
        sharpWrapper.operation('resize', {
          width: options.width,
          height: options.height,
          fit: 'inside',
          kernel: 'cubic',

          withoutEnlargement: options.shrinkonly,
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
    const result = await sharpWrapper.finish(targetFiletype, options);
    if (HasFailed(result)) return result;

    return {
      image: result.data,
      filetype: targetFiletype.identifier,
    };
  }

  private async convertAnimation(
    image: Buffer,
    targetFiletype: FileType,
    options: ImageRequestParams,
  ): AsyncFailable<ImageResult> {
    // Apng and gif are stored as is for now
    return {
      image: image,
      filetype: targetFiletype.identifier,
    };
  }
}
