'use strict';

/**
 * Encode a QOI file.
 *
 * @param {Uint8Array|Uint8ClampedArray} colorData Array containing the color information for each pixel of the image (left to right, top to bottom)
 * @param {object} description
 * @param {int} description.width Width of the image
 * @param {int} description.height Height of the image
 * @param {int} description.channels Number of channels in the image (3: RGB, 4: RGBA)
 * @param {int} description.colorspace Colorspace used in the image (0: sRGB with linear alpha, 1: linear)
 *
 * @returns {ArrayBuffer} ArrayBuffer containing the QOI file content
 */
export function QOIencodeJS(
  colorData: Uint8Array | Uint8ClampedArray,
  description: {
    width: number;
    height: number;
    channels: number;
    colorspace: number;
  },
) {
  const width = description.width;
  const height = description.height;
  const channels = description.channels;
  const colorspace = description.colorspace;

  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 255;
  let prevRed = red;
  let prevGreen = green;
  let prevBlue = blue;
  let prevAlpha = alpha;

  let run = 0;
  let p = 0;
  const pixelLength = width * height * channels;
  const pixelEnd = pixelLength - channels;

  if (width < 0 || width >= 4294967296) {
    throw new Error('QOI.encode: Invalid description.width');
  }

  if (height < 0 || height >= 4294967296) {
    throw new Error('QOI.encode: Invalid description.height');
  }

  if (
    colorData.constructor.name !== 'Uint8Array' &&
    colorData.constructor.name !== 'Uint8ClampedArray'
  ) {
    throw new Error(
      'QOI.encode: The provided colorData must be instance of Uint8Array or Uint8ClampedArray',
    );
  }

  if (colorData.length !== pixelLength) {
    throw new Error('QOI.encode: The length of colorData is incorrect');
  }

  if (channels !== 3 && channels !== 4) {
    throw new Error('QOI.encode: Invalid description.channels, must be 3 or 4');
  }

  if (colorspace !== 0 && colorspace !== 1) {
    throw new Error(
      'QOI.encode: Invalid description.colorspace, must be 0 or 1',
    );
  }

  const maxSize = width * height * (channels + 1) + 14 + 8;
  const result = new Uint8Array(maxSize);
  const index = new Uint8Array(64 * 4);

  // 0->3 : magic "qoif"
  result[p++] = 0x71;
  result[p++] = 0x6f;
  result[p++] = 0x69;
  result[p++] = 0x66;

  // 4->7 : width
  result[p++] = (width >> 24) & 0xff;
  result[p++] = (width >> 16) & 0xff;
  result[p++] = (width >> 8) & 0xff;
  result[p++] = width & 0xff;

  // 8->11 : height
  result[p++] = (height >> 24) & 0xff;
  result[p++] = (height >> 16) & 0xff;
  result[p++] = (height >> 8) & 0xff;
  result[p++] = height & 0xff;

  // 12 : channels, 13 : colorspace
  result[p++] = channels;
  result[p++] = colorspace;

  for (let pixelPos = 0; pixelPos < pixelLength; pixelPos += channels) {
    if (channels === 4) {
      red = colorData[pixelPos];
      green = colorData[pixelPos + 1];
      blue = colorData[pixelPos + 2];
      alpha = colorData[pixelPos + 3];
    } else {
      red = colorData[pixelPos];
      green = colorData[pixelPos + 1];
      blue = colorData[pixelPos + 2];
    }

    if (
      prevRed === red &&
      prevGreen === green &&
      prevBlue === blue &&
      prevAlpha === alpha
    ) {
      run++;

      // reached the maximum run length, or reached the end of colorData
      if (run === 62 || pixelPos === pixelEnd) {
        // QOI_OP_RUN
        result[p++] = 0b11000000 | (run - 1);
        run = 0;
      }
    } else {
      if (run > 0) {
        // QOI_OP_RUN
        result[p++] = 0b11000000 | (run - 1);
        run = 0;
      }

      const indexPosition =
        ((red * 3 + green * 5 + blue * 7 + alpha * 11) % 64) * 4;

      if (
        index[indexPosition] === red &&
        index[indexPosition + 1] === green &&
        index[indexPosition + 2] === blue &&
        index[indexPosition + 3] === alpha
      ) {
        result[p++] = indexPosition / 4;
      } else {
        index[indexPosition] = red;
        index[indexPosition + 1] = green;
        index[indexPosition + 2] = blue;
        index[indexPosition + 3] = alpha;

        if (alpha === prevAlpha) {
          // ternary with bitmask handles the wraparound
          let vr = red - prevRed;
          vr = vr & 0b10000000 ? (vr - 256) % 256 : (vr + 256) % 256;
          let vg = green - prevGreen;
          vg = vg & 0b10000000 ? (vg - 256) % 256 : (vg + 256) % 256;
          let vb = blue - prevBlue;
          vb = vb & 0b10000000 ? (vb - 256) % 256 : (vb + 256) % 256;

          const vg_r = vr - vg;
          const vg_b = vb - vg;

          if (vr > -3 && vr < 2 && vg > -3 && vg < 2 && vb > -3 && vb < 2) {
            // QOI_OP_DIFF
            result[p++] =
              0b01000000 | ((vr + 2) << 4) | ((vg + 2) << 2) | (vb + 2);
          } else if (
            vg_r > -9 &&
            vg_r < 8 &&
            vg > -33 &&
            vg < 32 &&
            vg_b > -9 &&
            vg_b < 8
          ) {
            // QOI_OP_LUMA
            result[p++] = 0b10000000 | (vg + 32);
            result[p++] = ((vg_r + 8) << 4) | (vg_b + 8);
          } else {
            // QOI_OP_RGB
            result[p++] = 0b11111110;
            result[p++] = red;
            result[p++] = green;
            result[p++] = blue;
          }
        } else {
          // QOI_OP_RGBA
          result[p++] = 0b11111111;
          result[p++] = red;
          result[p++] = green;
          result[p++] = blue;
          result[p++] = alpha;
        }
      }
    }

    prevRed = red;
    prevGreen = green;
    prevBlue = blue;
    prevAlpha = alpha;
  }

  // 00000001 end marker/padding
  result[p++] = 0;
  result[p++] = 0;
  result[p++] = 0;
  result[p++] = 0;
  result[p++] = 0;
  result[p++] = 0;
  result[p++] = 0;
  result[p++] = 1;

  // return an ArrayBuffer trimmed to the correct length
  return result.buffer.slice(0, p);
}
