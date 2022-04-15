import { Injectable } from '@nestjs/common';
import { Fail, Failable } from 'picsur-shared/dist/types';
import {
  FullMime,
  SupportedAnimMimes,
  SupportedImageMimes,
  SupportedMimeCategory
} from '../../models/dto/mimes.dto';

@Injectable()
export class MimesService {
  public getFullMime(mime: string): Failable<FullMime> {
    if (SupportedImageMimes.includes(mime)) {
      return { mime, type: SupportedMimeCategory.Image };
    }
    if (SupportedAnimMimes.includes(mime)) {
      return { mime, type: SupportedMimeCategory.Animation };
    }
    return Fail('Unsupported mime type');
  }
}
