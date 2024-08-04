import {
  Ext2FileType,
  FileType,
  Mime2FileType,
  SupportedAnimFileTypes,
  SupportedFileTypeCategory,
  SupportedImageFileTypes,
} from '../dto/mimes.dto.js';
import { Fail, Failable, FT, HasFailed } from '../types/failable.js';

export function ParseFileType(filetype: string): Failable<FileType> {
  if (SupportedImageFileTypes.includes(filetype))
    return { identifier: filetype, category: SupportedFileTypeCategory.Image };

  if (SupportedAnimFileTypes.includes(filetype))
    return {
      identifier: filetype,
      category: SupportedFileTypeCategory.Animation,
    };

  return Fail(FT.UsrValidation, 'Unsupported file type');
}

export function ParseExt2FileType(ext: string): Failable<FileType> {
  const result = Ext2FileType(ext);
  if (HasFailed(result)) return result;
  return ParseFileType(result);
}

export function ParseMime2FileType(mime: string): Failable<FileType> {
  const result = Mime2FileType(mime);
  if (HasFailed(result)) return result;
  return ParseFileType(result);
}
