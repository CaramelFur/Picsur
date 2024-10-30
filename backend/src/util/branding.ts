import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { AsyncFailable, Fail, FT } from 'picsur-shared/dist/types/failable';
import { PackageRoot } from '../config/config.static.js';

export const BrandingPath = resolve(PackageRoot, '../branding');

export enum BrandMessageType {
  NotFound = 'notfound',
}

export interface BrandMessage {
  type: string;
  data: Buffer;
}

const BrandMessageCache: Record<string, BrandMessage> = {};

export async function GetBrandMessage(
  name: BrandMessageType,
): AsyncFailable<BrandMessage> {
  if (BrandMessageCache[name]) {
    return BrandMessageCache[name];
  }

  try {
    const file = await readFile(
      resolve(BrandingPath, 'messages', name + '.png'),
    );
    BrandMessageCache[name] = {
      type: 'image/png',
      data: file,
    };
    return BrandMessageCache[name];
  } catch (e) {
    return Fail(FT.Internal, e);
  }
}
