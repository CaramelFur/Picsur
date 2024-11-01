import { Injectable } from '@nestjs/common';
import {
  AnimFileType,
  FileType,
  ImageFileType,
  SupportedFileTypeCategory,
} from 'picsur-shared/dist/dto/mimes.dto';

import {
  AsyncFailable,
  Fail,
  FT,
  HasFailed,
} from 'picsur-shared/dist/types/failable';
import { ParseFileType } from 'picsur-shared/dist/util/parse-mime';
import { ImageConverterService } from './image-converter.service.js';
import { ImageResult } from './imageresult.js';

@Injectable()
export class ImageProcessorService {
  constructor(private readonly imageConverter: ImageConverterService) {}

  public async process(
    image: Buffer,
    filetype: FileType,
  ): AsyncFailable<ImageResult> {
    if (filetype.category === SupportedFileTypeCategory.Image) {
      return await this.processStill(image, filetype);
    } else if (filetype.category === SupportedFileTypeCategory.Animation) {
      return await this.processAnimation(image, filetype);
    } else {
      return Fail(FT.SysValidation, 'Unsupported mime type');
    }
  }

  private async processStill(
    image: Buffer,
    filetype: FileType,
  ): AsyncFailable<ImageResult> {
    const outputFileType = ParseFileType(ImageFileType.QOI);
    if (HasFailed(outputFileType)) return outputFileType;

    return this.imageConverter.convert(image, filetype, outputFileType, {});
  }

  private async processAnimation(
    image: Buffer,
    filetype: FileType,
  ): AsyncFailable<ImageResult> {
    const outputFileType = ParseFileType(AnimFileType.WEBP);
    if (HasFailed(outputFileType)) return outputFileType;

    return this.imageConverter.convert(image, filetype, outputFileType, {
      lossless: true,
      effort: 0,
    });
  }
}
