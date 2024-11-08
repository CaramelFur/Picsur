import { Fail, Failable, FT } from '../types/failable.js';

// Config
export enum ImageFileType {
  QOI = 'image:qoi',
  JPEG = 'image:jpeg',
  PNG = 'image:png',
  WEBP = 'image:webp',
  TIFF = 'image:tiff',
  AVIF = 'image:avif',
  HEIF = 'image:heif',
  JXL = 'image:jxl',
  JP2 = 'image:jp2',
  BMP = 'image:bmp',
  // ICO = 'image:ico',
}

export enum AnimFileType {
  GIF = 'anim:gif',
  WEBP = 'anim:webp',
  //APNG = 'anim:apng',
}

// Derivatives

export const SupportedImageFileTypes: string[] = Object.values(ImageFileType);
export const SupportedAnimFileTypes: string[] = Object.values(AnimFileType);
export const SupportedFileTypes: string[] = Object.values({
  ...ImageFileType,
  ...AnimFileType,
});

export enum SupportedFileTypeCategory {
  Image = 'image',
  Animation = 'anim',
}

export interface FileType {
  identifier: string;
  category: SupportedFileTypeCategory;
}

// Converters

// -- Mime

const FileType2MimeMap: {
  [key in ImageFileType | AnimFileType]: string;
} = {
  [AnimFileType.GIF]: 'image/gif',
  [AnimFileType.WEBP]: 'image/webp',
  // [AnimFileType.APNG]: 'image/apng',
  [ImageFileType.QOI]: 'image/x-qoi',
  [ImageFileType.JPEG]: 'image/jpeg',
  [ImageFileType.PNG]: 'image/png',
  [ImageFileType.WEBP]: 'image/webp', // Image webp comes later, so will be default
  [ImageFileType.TIFF]: 'image/tiff',
  [ImageFileType.AVIF]: 'image/avif',
  [ImageFileType.HEIF]: 'image/heic',
  [ImageFileType.JXL]: 'image/jxl',
  [ImageFileType.JP2]: 'image/jp2',
  [ImageFileType.BMP]: 'image/bmp',
  // [ImageFileType.ICO]: 'image/x-icon',
};

export const Mime2FileType = (mime: string): Failable<string> => {
  const entries = Object.entries(FileType2MimeMap).filter(
    ([, v]) => v === mime,
  );
  if (entries.length === 0)
    return Fail(FT.Internal, undefined, `Unsupported mime type: ${mime}`);
  return entries[0][0];
};
export const FileType2Mime = (filetype: string): Failable<string> => {
  const result = FileType2MimeMap[filetype as ImageFileType | AnimFileType];
  if (result === undefined)
    return Fail(FT.Internal, undefined, `Unsupported filetype: ${filetype}`);
  return result;
};

// -- Ext

const FileType2ExtMap: {
  [key in ImageFileType | AnimFileType]: string;
} = {
  [AnimFileType.GIF]: 'gif',
  [AnimFileType.WEBP]: 'webp',
  // [AnimFileType.APNG]: 'apng',
  [ImageFileType.QOI]: 'qoi',
  [ImageFileType.JPEG]: 'jpg',
  [ImageFileType.PNG]: 'png',
  [ImageFileType.WEBP]: 'webp',
  [ImageFileType.TIFF]: 'tiff',
  [ImageFileType.AVIF]: 'avif',
  [ImageFileType.HEIF]: 'heif',
  [ImageFileType.JXL]: 'jxl',
  [ImageFileType.JP2]: 'jp2',
  [ImageFileType.BMP]: 'bmp',
  // [ImageFileType.ICO]: 'ico',
};

export const Ext2FileType = (ext: string): Failable<string> => {
  const entries = Object.entries(FileType2ExtMap).filter(([, v]) => v === ext);
  if (entries.length === 0)
    return Fail(FT.Internal, undefined, `Unsupported ext: ${ext}`);
  return entries[0][0];
};

export const FileType2Ext = (mime: string): Failable<string> => {
  const result = FileType2ExtMap[mime as ImageFileType | AnimFileType];
  if (result === undefined)
    return Fail(FT.Internal, undefined, `Unsupported mime type: ${mime}`);
  return result;
};
