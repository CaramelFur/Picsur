import { EImage } from 'picsur-shared/dist/entities/image.entity';
import { EImageBackend } from '../entities/image.entity';

export function EImageBackend2EImage(
  eImage: EImageBackend,
): EImage {
  if (eImage.data === undefined) 
    return eImage as EImage;

  return {
    ...eImage,
    data: undefined,
  };
}
