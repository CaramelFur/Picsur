import { BMPdecode } from 'bmp-img';
import { FullMime, ImageMime } from 'picsur-shared/dist/dto/mimes.dto';
import { QOIdecode } from 'qoi-img';
import sharp, { Sharp, SharpOptions } from 'sharp';

export function UniversalSharp(
  image: Buffer,
  mime: FullMime,
  options?: SharpOptions,
): Sharp {
  // if (mime.mime === ImageMime.ICO) {
  //   return icoSharp(image, options);
  // } else 
  if (mime.mime === ImageMime.BMP) {
    return bmpSharp(image, options);
  } else 
  if (mime.mime === ImageMime.QOI) {
    return qoiSharp(image, options);
  } else {
    return sharp(image, options);
  }
}

function bmpSharp(image: Buffer, options?: SharpOptions) {
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

// function icoSharp(image: Buffer, options?: SharpOptions) {
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

function qoiSharp(image: Buffer, options?: SharpOptions) {
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
