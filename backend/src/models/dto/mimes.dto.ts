// Config
export enum ImageMime {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  TIFF = 'image/tiff',
  BMP = 'image/bmp',
  ICO = 'image/x-icon',
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
