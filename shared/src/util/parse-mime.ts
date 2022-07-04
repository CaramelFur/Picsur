import {
  FullMime,
  SupportedAnimMimes,
  SupportedImageMimes,
  SupportedMimeCategory
} from '../dto/mimes.dto';
import { Fail, Failable, FT } from '../types';

export function ParseMime(mime: string): Failable<FullMime> {
  if (SupportedImageMimes.includes(mime))
    return { mime, type: SupportedMimeCategory.Image };

  if (SupportedAnimMimes.includes(mime))
    return { mime, type: SupportedMimeCategory.Animation };

  return Fail(FT.Validation, 'Unsupported mime type');
}
