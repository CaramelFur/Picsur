// Config
export enum ImageMime {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  TIFF = 'image/tiff',
  BMP = 'image/bmp',
  // ICO = 'image/x-icon',
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

export const ImageMime2ExtMap: {
  [key in ImageMime]: string;
} = {
  [ImageMime.QOI]: 'qoi',
  [ImageMime.JPEG]: 'jpg',
  [ImageMime.PNG]: 'png',
  [ImageMime.WEBP]: 'webp',
  [ImageMime.TIFF]: 'tiff',
  [ImageMime.BMP]: 'bmp',
  // [ImageMime.ICO]: 'ico',
};

export const AnimMime2ExtMap: {
  [key in AnimMime]: string;
} = {
  [AnimMime.GIF]: 'gif',
  [AnimMime.APNG]: 'apng',
};

export const Mime2ExtMap: {
  [key in ImageMime | AnimMime]: string;
} = {
  ...ImageMime2ExtMap,
  ...AnimMime2ExtMap,
};

export const Ext2MimeMap: {
  [key: string]: string;
} = Object.fromEntries(Object.entries(Mime2ExtMap).map(([k, v]) => [v, k]));

export const Mime2Ext = (mime: string): string | undefined => {
  return Mime2ExtMap[mime as ImageMime | AnimMime];
};

export const Ext2Mime = (ext: string): string | undefined => {
  return Ext2MimeMap[ext];
};
