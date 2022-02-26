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

const SupportedMimesTuple = [
  ...SupportedImageMimesTuple,
  ...SupportedAnimMimesTuple,
];

// Derivatives

export const SupportedImageMimes: string[] = SupportedImageMimesTuple;
export const SupportedAnimMimes: string[] = SupportedAnimMimesTuple;

export const SupportedMimes: string[] = SupportedMimesTuple;
export type SupportedMime = typeof SupportedMimesTuple[number];
export type SupportedMimeCategory = 'image' | 'anim';

export interface FullMime {
  mime: SupportedMime;
  type: SupportedMimeCategory;
}
