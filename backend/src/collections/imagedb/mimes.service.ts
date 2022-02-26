import { Injectable } from '@nestjs/common';
import { Fail, Failable } from 'imagur-shared/dist/types';
import {
  FullMime,
  SupportedAnimMimes,
  SupportedImageMimes,
  SupportedMime,
} from 'imagur-shared/dist/dto/mimes.dto';

@Injectable()
export class MimesService {
  public getFullMime(mime: string): Failable<FullMime> {
    if (SupportedImageMimes.includes(mime)) {
      return { mime: mime as SupportedMime, type: 'image' };
    }
    if (SupportedAnimMimes.includes(mime)) {
      return { mime: mime as SupportedMime, type: 'anim' };
    }
    return Fail('Unsupported mime type');
  }
}
