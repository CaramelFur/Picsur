// Config
export enum ImageMime {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  TIFF = 'image/tiff',
  BMP = 'image/bmp',
  ICO = 'image/x-icon',
  QOI = 'image/x-qoi',
}

export enum AnimMime {
  APNG = 'image/apng',
  GIF = 'image/gif',
}

export const SupportedMime = { ...ImageMime, ...AnimMime };

// Derivatives

export const SupportedImageMimes: string[] = Object.values(ImageMime);
export const SupportedAnimMimes: string[] = Object.values(AnimMime);
export const SupportedMimes: string[] = Object.values(SupportedMime);

export enum SupportedMimeCategory {
  Image = 'image',
  Animation = 'anim',
}

export interface FullMime {
  mime: string;
  type: SupportedMimeCategory;
}

export const MimeExtMap: {
  [key in ImageMime | AnimMime]: string;
} = {
  [ImageMime.JPEG]: 'jpg',
  [ImageMime.PNG]: 'png',
  [ImageMime.WEBP]: 'webp',
  [ImageMime.TIFF]: 'tiff',
  [ImageMime.BMP]: 'bmp',
  [ImageMime.ICO]: 'ico',
  [ImageMime.QOI]: 'qoi',

  [AnimMime.APNG]: 'apng',
  [AnimMime.GIF]: 'gif',
};

export const MimeExt = (mime: string): string | undefined => {
  return MimeExtMap[mime as ImageMime | AnimMime];
}
