import { Injectable } from '@nestjs/common';
import { Fail, Failable } from 'src/types/failable';

const tuple = <T extends string[]>(...args: T): T => args;

// Config

const SupportedImageMimesTuple = tuple(
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
  'image/bmp',
  'image/x-icon',
);

const SupportedAnimMimesTuple = tuple('image/apng', 'image/gif');

// Derivatives

export const SupportedImageMimes: string[] = SupportedImageMimesTuple;
export const SupportedAnimMimes: string[] = SupportedAnimMimesTuple;

export const SupportedMimes: string[] = [
  ...SupportedImageMimes,
  ...SupportedAnimMimes,
];
export type SupportedMime = typeof SupportedMimes[number];
export type SupportedMimeCategory = 'image' | 'anim';

export interface FullMime {
  mime: SupportedMime;
  type: SupportedMimeCategory;
}

@Injectable()
export class MimesService {
  getFullMime(mime: string): Failable<FullMime> {
    if (SupportedImageMimes.includes(mime)) {
      return { mime, type: 'image' };
    }
    if (SupportedAnimMimes.includes(mime)) {
      return { mime, type: 'anim' };
    }
    return Fail('Unsupported mime type');
  }
}
