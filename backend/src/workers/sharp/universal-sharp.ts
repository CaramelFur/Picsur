import { BMPdecode, BMPencode } from 'bmp-img';
import { FullMime, ImageMime } from 'picsur-shared/dist/dto/mimes.dto';
import { QOIdecode, QOIencode } from 'qoi-img';
import sharp, { Sharp, SharpOptions } from 'sharp';

export interface SharpResult {
  data: Buffer;
  info: sharp.OutputInfo;
}

export function UniversalSharpIn(
  image: Buffer,
  mime: FullMime,
  options?: SharpOptions,
): Sharp {
  // if (mime.mime === ImageMime.ICO) {
  //   return icoSharpIn(image, options);
  // } else
  if (mime.mime === ImageMime.BMP) {
    return bmpSharpIn(image, options);
  } else if (mime.mime === ImageMime.QOI) {
    return qoiSharpIn(image, options);
  } else {
    return sharp(image, options);
  }
}

function bmpSharpIn(image: Buffer, options?: SharpOptions) {
  const bitmap = BMPdecode(image);
  return sharp(bitmap.pixels, {
    ...options,
    raw: {
      width: bitmap.width,
      height: bitmap.height,
      channels: bitmap.channels,
    },
  });
}

// function icoSharpIn(image: Buffer, options?: SharpOptions) {
//   const result = decodeico(image);
//   // Get biggest image
//   const best = result.sort((a, b) => b.width - a.width)[0];

//   return sharp(best.data, {
//     ...options,
//     raw: {
//       width: best.width,
//       height: best.height,
//       channels: 4,
//     },
//   });
// }

function qoiSharpIn(image: Buffer, options?: SharpOptions) {
  const result = QOIdecode(image);

  return sharp(result.pixels, {
    ...options,
    raw: {
      width: result.width,
      height: result.height,
      channels: result.channels,
    },
  });
}

export async function UniversalSharpOut(
  image: Sharp,
  mime: FullMime,
  options?: {
    quality?: number;
  },
): Promise<SharpResult> {
  let result: SharpResult | undefined;

  switch (mime.mime) {
    case ImageMime.PNG:
      result = await image
        .png({ quality: options?.quality })
        .toBuffer({ resolveWithObject: true });
      break;
    case ImageMime.JPEG:
      result = await image
        .jpeg({ quality: options?.quality })
        .toBuffer({ resolveWithObject: true });
      break;
    case ImageMime.TIFF:
      result = await image
        .tiff({ quality: options?.quality })
        .toBuffer({ resolveWithObject: true });
      break;
    case ImageMime.WEBP:
      result = await image
        .webp({ quality: options?.quality })
        .toBuffer({ resolveWithObject: true });
      break;
    case ImageMime.BMP:
      result = await bmpSharpOut(image);
      break;
    case ImageMime.QOI:
      result = await qoiSharpOut(image);
      break;
    default:
      throw new Error('Unsupported mime type');
  }

  return result;
}

async function bmpSharpOut(sharpImage: Sharp): Promise<SharpResult> {
  const raw = await sharpImage.raw().toBuffer({ resolveWithObject: true });

  if (raw.info.channels === 1) no1Channel(raw);

  const encoded = BMPencode(raw.data, {
    width: raw.info.width,
    height: raw.info.height,
    channels: raw.info.channels,
  });

  return {
    data: encoded,
    info: raw.info,
  };
}

async function qoiSharpOut(sharpImage: Sharp): Promise<SharpResult> {
  const raw = await sharpImage.raw().toBuffer({ resolveWithObject: true });

  if (raw.info.channels === 1) no1Channel(raw);

  const encoded = QOIencode(raw.data, {
    width: raw.info.width,
    height: raw.info.height,
    channels: raw.info.channels,
  });

  return {
    data: encoded,
    info: raw.info,
  };
}

function no1Channel(input: SharpResult): SharpResult {
  const old = input.data;
  input.data = Buffer.alloc(input.info.width * input.info.height * 3);

  for (let i = 0; i < old.length; i++) {
    input.data[i * 3] = old[i];
    input.data[i * 3 + 1] = old[i];
    input.data[i * 3 + 2] = old[i];
  }

  input.info.channels = 3;
  input.info.size = input.data.length;

  return input;
}
