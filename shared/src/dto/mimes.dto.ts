import { Fail, Failable, FT } from '../types';

// Config
export enum ImageFileType {
  QOI = 'image:qoi',
  JPEG = 'image:jpeg',
  PNG = 'image:png',
  WEBP = 'image:webp',
  TIFF = 'image:tiff',
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
  [ImageFileType.BMP]: 'bmp',
  // [ImageFileType.ICO]: 'ico',
};

const Ext2FileTypeMap: {
  [key: string]: string;
} = Object.fromEntries(Object.entries(FileType2ExtMap).map(([k, v]) => [v, k]));

export const FileType2Ext = (mime: string): Failable<string> => {
  const result = FileType2ExtMap[mime as ImageFileType | AnimFileType];
  if (result === undefined)
    return Fail(FT.Internal, undefined, `Unsupported mime type: ${mime}`);
  return result;
};

export const Ext2FileType = (ext: string): Failable<string> => {
  const result = Ext2FileTypeMap[ext];
  if (result === undefined)
    return Fail(FT.Internal, undefined, `Unsupported ext: ${ext}`);
  return result;
};

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
  [ImageFileType.WEBP]: 'image/webp',
  [ImageFileType.TIFF]: 'image/tiff',
  [ImageFileType.BMP]: 'image/bmp',
  // [ImageFileType.ICO]: 'image/x-icon',
};

const Mime2FileTypeMap: {
  [key: string]: string;
} = Object.fromEntries(
  Object.entries(FileType2MimeMap).map(([k, v]) => [v, k]),
);

export const Mime2FileType = (mime: string): Failable<string> => {
  const result = Mime2FileTypeMap[mime as ImageFileType | AnimFileType];
  if (result === undefined)
    return Fail(FT.Internal, undefined, `Unsupported mime type: ${mime}`);
  return result;
};
export const FileType2Mime = (filetype: string): Failable<string> => {
  const result = FileType2MimeMap[filetype as ImageFileType | AnimFileType];
  if (result === undefined)
    return Fail(FT.Internal, undefined, `Unsupported filetype: ${filetype}`);
  return result;
};
