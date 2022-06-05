import {
  FullMime,
  SupportedAnimMimes,
  SupportedImageMimes,
  SupportedMimeCategory,
} from '../dto/mimes.dto';
import { Fail, Failable } from '../types';

export function ParseMime(mime: string): Failable<FullMime> {
  if (SupportedImageMimes.includes(mime)) {
    return { mime, type: SupportedMimeCategory.Image };
  }
  if (SupportedAnimMimes.includes(mime)) {
    return { mime, type: SupportedMimeCategory.Animation };
  }
  return Fail('Unsupported mime type');
}
